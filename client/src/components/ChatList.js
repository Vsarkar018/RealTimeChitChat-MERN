import React, { useEffect, useState } from "react";
import { useChatContext } from "../context/ChatProvider";
import {
  Box,
  Button,
  useToast,
  Text,
  Stack,
  Menu,
  MenuButton,
  IconButton,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import axios from "axios";
import ChatLoading from "./misc/ChatLoading";
import { getSender } from "../config/Logic";
import GroupChatModal from "./misc/GroupChatModal";
const ChatList = () => {
  const [loggedUser, setLoggedUser] = useState();
  const [toBeDeleteChat, setToBeDeletechat] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats, fetchAgain } =
    useChatContext();
  const Toast = useToast();

  const fetchChats = async () => {
    try {
      const { data } = await axios.get("/api/v1/chats/", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setChats(data);
    } catch (error) {
      Toast({
        title: "Error Occured",
        status: "Error",
        description: error.response.data,
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
  };
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        py={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        display="flex"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#7FBBDA"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflow="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => {
              return (
                <Box
                  key={chat._id}
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={selectedChat === chat ? "#0077b6" : "#E8E8E8"}
                  color={selectedChat === chat ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius="lg"
                >
                  <Text>
                    {!chat.isGroup && chat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                    {chat.latestMessage && (
                      <Text fontSize="xs">
                        <b>{chat.latestMessage.sender.name} : </b>
                        {chat.latestMessage.content.length > 50
                          ? chat.latestMessage.content.substring(0, 51) + "..."
                          : chat.latestMessage.content}
                      </Text>
                    )}
                  </Text>
                </Box>
              );
            })}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default ChatList;
