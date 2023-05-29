import React, { useEffect, useState } from "react";
import { useChatContext } from "../../context/ChatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderDetails } from "../../config/Logic";
import ProfileModal from "./ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import axios from "axios";
import ChatMessage from "./ChatMessage";
import { m } from "framer-motion";
const SingleChat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const { user, selectedChat, setSelectedChat } = useChatContext();
  const toast = useToast();
  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      try {
        const { data } = await axios.post(
          "/api/v1/msgs",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        console.log(data);
        setNewMessage("");
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured",
          description: error.response.data,
          duration: 2000,
          isClosable: true,
          status: "error",
          position: "bottom",
        });
      }
    }
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  };
  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get(`api/v1/msgs/${selectedChat._id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setMessages(data);
      setLoading(false);
      console.log(messages);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: error.response.data,
        duration: 2000,
        isClosable: true,
        status: "error",
        position: "bottom",
      });
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);
  console.log(messages);
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
                  user={
                    selectedChat && getSenderDetails(user, selectedChat.users)
                  }
                />
              </>
            ) : (
              <>
                {selectedChat.chatName}
                <UpdateGroupChatModal />
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
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  overflow: "scroll",
                  scrollbarWidth: "none",
                }}
              >
                <ChatMessage messages={messages}/>
              </div>
            )}

            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              <Input
                placeholder="Message..."
                bg="#e0e0e0"
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
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
