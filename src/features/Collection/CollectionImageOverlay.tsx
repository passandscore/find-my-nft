import { Badge, Box, Flex } from "@mantine/core";
import React from "react";

export const CollectionImageOverlay = ({
  handleSelectedToken,
  item,
}: {
  handleSelectedToken: (tokenId: string) => void;
  item: { tokenId: string; image: string };
}) => {
  return (
    <Flex
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(5px)",
        color: "white",
        opacity: 0,
        transition: "opacity 0.3s ease-in-out",
        zIndex: 1,
        "&:hover": {
          opacity: 1,
        },
      }}
    >
      <Box>
        <Badge
          sx={{
            cursor: "pointer",
            marginLeft: 10,
          }}
          size="lg"
          variant="gradient"
          gradient={{ from: "yellow", to: "orange" }}
          onClick={handleSelectedToken(item.tokenId)!}
        >
          {`view token ${item.tokenId}`}
        </Badge>
      </Box>
    </Flex>
  );
};
