import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  purchases: [
    {
      type: Schema.Types.ObjectId,
      ref: "Purchase",
    },
  ],
  state: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  referralID: {
    type: String,
  },
  refCode: {
    type: String,
  },
  earnedCOPs: [
    {
      type: Schema.Types.ObjectId,
      ref: "COP",
    },
  ],
  checkoutCOPs: [
    {
      type: Schema.Types.ObjectId,
      ref: "CheckoutCOP",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = model("User", userSchema);
