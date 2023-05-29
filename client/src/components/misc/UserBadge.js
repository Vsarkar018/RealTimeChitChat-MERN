import React from "react";
import { Box } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
const UserBadge = ({ user, handleFunction }) => {
  return (
    <div>
      <Box
        px={2}
        py={1}
        borderRadius="lg"
        m={1}
        mb={2}
        variant="solid"
        fontSize={12}
        bg="#7FBBDA"
        cursor="pointer"
        onClick={handleFunction}
        fontWeight="bold"
      >
        {user.name}
        <CloseIcon pl={1}  />
      </Box>
    </div>
  );
};

export default UserBadge;
