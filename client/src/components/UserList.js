import React from "react";
import { Avatar, Box ,Text} from "@chakra-ui/react";
const UserList = ({user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{ background: "#38b2ac", color: "white" }}
      w="100%"
      display="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={
          user.pic
            ? user.pic
            : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
        }
      />
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize='xs'><b>Email:</b>{user.email}</Text>
      </Box>
    </Box>
  );
};

export default UserList;
