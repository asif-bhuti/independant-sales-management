import React, { useEffect, useState } from "react";
import { Badge, Group, Text, ActionIcon, ScrollArea } from "@mantine/core";
import { IconPencil, IconTrash } from "@tabler/icons-react";

import tw from "twin.macro";
import styled from "@emotion/styled";

const HeaderContainer = styled.div`
  ${tw`grid grid-cols-12 gap-4 w-full py-2 h-12 border-b-2`}
`;

const RowContainer = styled.div`
  ${tw`my-0 pr-1 font-light grid grid-cols-12 gap-4 items-center w-full rounded-lg h-12 hover:bg-backgroundColor-secondary`}
`;

const roleColors = {
  manager: "blue",
  "generator-leader": "teal",
  generator: "red",
  prescriptor: "emerald",
  agent: "yellow",
  "co-user": "black",
  user: "gray",
};

export function UserList({ data }) {
  useEffect(() => {}, []);
  const sortedData = data.sort((a, b) =>
    a.firstName.localeCompare(b.firstName)
  );

  const rows = sortedData.map((item) => {
    return (
      <>
        {item.role === "manager" ? (
          ""
        ) : (
          <RowContainer key={item._id}>
            <div className="col-start-1 col-span-2 pl-4">
              <Text fz="sm" fw={500}>
                {item.firstName}
              </Text>
            </div>

            <div className="col-span-2 pl-4">
              <Badge color={roleColors[item.role.toLowerCase()]}>
                {item.role}
              </Badge>
            </div>
            <div className="col-span-3 pl-4 text-textColor-tertiary">
              {item.email}
            </div>
            <div className="col-span-3 pl-4">
              {item.referredBy[0] ? (
                <div className="flex  justify-between items-center">
                  {item.referredBy[0].firstName}
                  <Badge color={roleColors[item.role.toLowerCase()]}>
                    {item.referredBy[0].role}
                  </Badge>
                </div>
              ) : (
                "None"
              )}
            </div>

            <div className="col-end-13 ">
              <Group spacing={0} position="right">
                <ActionIcon onClick={() => {}}>
                  <IconPencil size="1rem" stroke={1.5} />
                </ActionIcon>
                <ActionIcon color="red">
                  <IconTrash size="1rem" stroke={1.5} />
                </ActionIcon>
              </Group>
            </div>
          </RowContainer>
        )}
      </>
    );
  });

  return (
    <div className="flex flex-col w-full">
      <HeaderContainer>
        <div className="col-start-1 col-span-2 pl-4 border-gray-600 border rounded-2xl">
          Name
        </div>
        <div className="col-span-2 pl-4 border-gray-600 border rounded-2xl">
          Role
        </div>
        <div className="col-span-3 pl-4 border-gray-600 border rounded-2xl">
          Email
        </div>
        <div
          className="col-span-3 px-4 border-gray-600 border rounded-2xl
        "
        >
          <div className="flex justify-between">
            <span> Links to</span>
            <span className="text-textColor-tertiary"> Role</span>
          </div>
        </div>
        <div className="col-end-13 pl-4 border-gray-600 border rounded-2xl">
          Action
        </div>
      </HeaderContainer>
      <ScrollArea h={520} scrollbarSize={4} offsetScrollbars>
        <div>{rows}</div>
      </ScrollArea>
    </div>
  );
}