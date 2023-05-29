import React from "react";
import { useChatContext } from "../../context/ChatProvider";
import { Box, IconButton, Text } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender ,getSenderDetails} from "../../config/Logic";
import ProfileModal from "./ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
const SingleChat = () => {
  const { fetchAgain, setFetchAgain, user, selectedChat, setSelectedChat } =
    useChatContext();
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            display="flex"
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroup ? (
              <>
                {selectedChat && getSender(user, selectedChat.users)}
                <ProfileModal
                  user={selectedChat && getSenderDetails(user, selectedChat.users)}
                />
              </>
            ) : (
              <>{selectedChat.chatName}
              <UpdateGroupChatModal/>
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          ></Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3}>
            Let's Go Chatting <br />
            Click on a user to start Chating
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
