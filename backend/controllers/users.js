import bcrypt from "bcryptjs";
import { User } from "../model/user.js";
import { COP } from "../model/COP.js";
import { generateRefCode } from "../helpers/generateRefCode.js";
import { getUserSubtree } from "../helpers/getUsersTree.js";

export const createUser = async (req, res) => {
  try {
    const {
      address,
      city,
      email,
      firstName,
      lastName,
      password,
      postalCode,
      referralID,
      role,
      state,
    } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "User with this email already exists!" });
    } else if (role === "Select Role") {
      return res.status(409).json({ error: "Please select a user role!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === "user" || role === "co-user" || role === "agent") {
      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
        address,
        city,
        state,
        postalCode,
        referralID,
      });
      const savedUser = await newUser.save();
      return res.status(201).json(`created user succesffully: ${savedUser}`);
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      address,
      city,
      state,
      postalCode,
      referralID,
    });
    const savedUser = await newUser.save();
    const referralCode = generateRefCode(savedUser._id.toString());

    savedUser.refCode = referralCode;

    console.log(savedUser);

    await savedUser.save();
    return res.status(201).json(`created user succesffully: ${savedUser}`);
  } catch (error) {
    console.log("error in createUser controller", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

export const findUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    res.status(200).json(user);
  } catch (error) {
    console.error("findUser", error);
    res.status(500).json({ error: "Failed to retrieve user" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log("req.user: ", req.user);
    console.log("userId: ", userId);
    if (req.user.role === "manager") {
      const result = await User.deleteOne({ _id: userId });
      if (result.deletedCount === 1) {
        return res.status(200).json("User has been deleted!");
      } else {
        return res.status(404).json("User not found.");
      }
    } else {
      res.status(403).json("Unauthorized request!");
    }
  } catch (error) {
    console.error("Error in deleteUser controller: ", error);
  }
};

export const getUserForAgent = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("userId:", userId);

    const user = await User.findById(userId);
    console.log("user:", user);

    if (user.role !== "agent") {
      console.log("User is not an agent");
      return res.json("the user is not an agent");
    }
    const users = await User.find({ role: { $in: ["user", "co-user"] } });
    console.log("users:", users);

    res.status(200).json(users);
  } catch (error) {
    console.error("getUserForManager:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserForManager = async (req, res) => {
  try {
    const users = await User.find();

    const referredUsers = users.map((user) => {
      const referredBy = users.filter((u) => u.refCode === user.referralID);
      const referredByData = referredBy.map(({ role, _id, firstName }) => ({
        role,
        id: _id,
        firstName,
      }));

      return {
        ...user._doc,
        referredBy: referredByData,
      };
    });

    res.status(200).json(referredUsers);
  } catch (error) {
    console.error("getUserForManager:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUsersWithPurchaseInfo = async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ["co-user", "user"] } })
      .populate({
        path: "purchases",
        populate: {
          path: "products.productId",
          model: "Product",
        },
      })
      .exec();

    const usersWithPurchaseInfo = users.map((user) => {
      const { purchases } = user;
      let lastPurchaseDate = null;
      let totalAmountSpent = 0;

      if (purchases.length > 0) {
        // Find the last purchase date
        const purchaseDates = purchases.map(
          (purchase) => purchase.purchaseDate
        );
        const maxDate = new Date(Math.max(...purchaseDates));
        lastPurchaseDate = maxDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        // Calculate total amount spent
        totalAmountSpent = purchases.reduce((total, purchase) => {
          const products = purchase.products;
          const purchaseAmount = products.reduce((amount, product) => {
            return amount + product.quantity * product.productId.price;
          }, 0);
          return total + purchaseAmount;
        }, 0);
      }

      return {
        _id: user._id,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
        referralID: user.referralID,
        lastPurchaseDate,
        totalAmountSpent,
      };
    });

    usersWithPurchaseInfo.sort((a, b) => a.email.localeCompare(b.email));

    res.json(usersWithPurchaseInfo);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserTree = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userTree = await getUserSubtree(user);

    res.status(200).json(userTree);
  } catch (error) {
    console.error("Error retrieving user tree:", error);
    res.status(500).json({ error: "Failed to retrieve user tree" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateUser = req.body;
    console.log(updateUser);

    const password = updateUser.password;
    const hashedPassword = await bcrypt.hash(password, 10);
    updateUser.password = hashedPassword;

    const user = await User.findByIdAndUpdate(userId, updateUser, {
      new: true,
    });
    console.log("Updated user:", user);

    if (updateUser.copValue) {
      // Create a new COP document
      const newCOP = new COP({
        refCode: user.refCode, // Make sure to provide the refCode value
        earnedPoints: updateUser.copValue,
      });

      console.log("New COP:", newCOP);

      // Save the new COP document
      await newCOP.save();

      // Add the newly created COP to the user's earnedCOPs array
      user.earnedCOPs.push(newCOP._id);

      // Save the updated user object
      await user.save();
      console.log("Updated user with COP:", user);
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("updateUser Error:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
};
