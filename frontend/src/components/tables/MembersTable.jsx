import React from "react";
import { ScrollArea } from "@mantine/core";
import tw from "twin.macro";
import styled from "@emotion/styled";

const HeaderContainer = styled.div`
  ${tw`flex justify-between w-full py-2 h-12 border-b-2`}
`;

const HeaderItems = styled.div(() => [
  tw`ml-6 my-0 pr-1 font-light flex justify-start items-center  text-textColor-tertiary `,
]);

const RowContainer = styled.div`
  ${tw`my-0 pr-1 font-light flex justify-between items-center w-full rounded-lg h-12 hover:bg-backgroundColor-secondary`}
`;

const RowItems = styled.div(({ tertiary }) => [
  tw`ml-6 my-0 pr-1 font-semibold flex justify-start items-center  group-hover:text-accent-primary`,
  tertiary && tw`text-textColor-tertiary`,
]);

export const MembersTable = ({ data }) => {
  const list = data.map((item) => {
    return (
      <RowContainer className="group" key={item._id}>
        <RowItems className="w-10">{item.firstName}</RowItems>
        <RowItems className="w-1/5 text-textColor-tertiary">
          {item.email}
        </RowItems>
        <RowItems tertiary className="w-1/5">
          {item.lastPurchaseDate}
        </RowItems>
        <RowItems className="w-24 !text-alert-ok">
          ${item.totalAmountSpent}
        </RowItems>
      </RowContainer>
    );
  });

  return (
    <div className="flex flex-col">
      <HeaderContainer>
        <HeaderItems tertiary className="w-10">
          Name
        </HeaderItems>
        <HeaderItems tertiary className="w-1/5">
          Email
        </HeaderItems>
        <HeaderItems secondary className="w-1/5">
          Last Purchase
        </HeaderItems>
        <HeaderItems secondary className="w-24">
          Amount
        </HeaderItems>
      </HeaderContainer>
      <ScrollArea h={420} scrollbarSize={4} offsetScrollbars>
        {list}
      </ScrollArea>
    </div>
  );
};
