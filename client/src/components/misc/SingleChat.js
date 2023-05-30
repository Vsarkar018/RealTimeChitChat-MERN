import React, { useEffect, useState } from "react";
import { useChatContext } from "../../context/ChatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  InputGroup,
  Spinner,
  Text,
  useToast,
  InputRightElement,
} from "@chakra-ui/react";
import { ArrowBackIcon, ArrowRightIcon } from "@chakra-ui/icons";
import { getSender, getSenderDetails } from "../../config/Logic";
import ProfileModal from "./ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import Lottie from "react-lottie";
import axios from "axios";
import io from "socket.io-client";
import ChatMessage from "./ChatMessage";
import animationData from "../../assets/typingAnimation.json";
const ENDPOINT = "http://localhost:5000";
let socket, selectedChatCompare;
const SingleChat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const {
    user,
    selectedChat,
    setSelectedChat,
    notification,
    setNotification,
    setFetchAgain,
    fetchAgain,
  } = useChatContext();
  const [typing, setTypinig] = useState(false);
  const [isTyping, setIsTypinig] = useState(false);
  const toast = useToast();
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTypinig(true));
    socket.on("stopTyping", () => setIsTypinig(false));
  }, []);

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stopTyping", selectedChat._id);
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
        socket.emit("sendMessage", data);
        setNewMessage("");
        const temp = messages;
        setMessages([...temp, data]);
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

    if (!socketConnected) {
      return;
    }
    if (!typing) {
      setTypinig(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTyping = new Date().getTime();
    let timer = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTyping;
      if (timeDiff >= timer && typing) {
        socket.emit("stopTyping", selectedChat._id);
        setTypinig(false);
      }
    }, timer);
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
      socket.emit("joinChat", selectedChat._id);
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
    selectedChatCompare = selectedChat;
  }, [selectedChat]);
  useEffect(() => {
    socket.on("messageRecieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          const temp = notification;
          setNotification([newMessageRecieved, ...temp]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        const temp = messages;
        setMessages([...temp, newMessageRecieved]);
      }
    });
  });
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
                <ChatMessage messages={messages} />
              </div>
            )}

            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? (
                <div>
                  <Lottie
                    options={{
                      loop: true,
                      autoplay: true,
                      animationData: animationData,
                      rendererSettings: {
                        preserveAspectRatio: "xMidYMid slice",
                      },
                    }}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <InputGroup>
                <Input
                  placeholder="Message..."
                  bg="#e0e0e0"
                  onChange={typingHandler}
                  value={newMessage}
                />
                <InputRightElement width="4.5rem">
                  <IconButton
                    h="1.75rem"
                    size="sm"
                    bg="#e0e0e0"
                    onClick={sendMessage}
                    icon={<ArrowRightIcon />}
                  />
                </InputRightElement>
              </InputGroup>
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
