import React, { useEffect, useState } from "react";
import axios from "axios";

const Chat = () => {
  const [chats, setChats] = useState("");
  const fetchChats = async () => {
    const {data} = await axios.get("api/chats");
    console.log(data);
    // setChats(data);
  };
  useEffect(() => {
    fetchChats();
  }, []);
  return (
    <div>
      <p>{chats}</p>
    </div>
  );
};

export default Chat;
