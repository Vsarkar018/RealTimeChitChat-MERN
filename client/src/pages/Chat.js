import React from "react";
import { useChatContext } from "../context/ChatProvider";
import { Box } from "@chakra-ui/react";

import SideDrawer from "../components/SideDrawer";
import ChatBox from "../components/ChatBox";
import ChatList from "../components/ChatList";

const Chat = () => {
  const { user } = useChatContext();
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p='10px'
      >
        {user && <ChatList />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
};

export default Chat;
