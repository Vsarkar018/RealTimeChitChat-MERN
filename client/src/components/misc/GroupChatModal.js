import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  useToast,
  FormControl,
  Input,
  Spinner,
  Box,
} from "@chakra-ui/react";
import { useChatContext } from "../../context/ChatProvider";
import axios from "axios";
import UserList from "../UserList";
import UserBadge from "./UserBadge";
const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { chats, user, setChats } = useChatContext();
  const handleSearch = async (e) => {
    setSearch(e);
    if (!e) {
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/user?search=${search}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: error.response.data,
        duration: 2000,
        status: "error",
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Select all the fields",
        duration: 2000,
        status: "warning",
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
    try {
      const { data } = await axios.post(
        "/api/v1/chats/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setChats([data, ...chats]);
      onClose();
      toast({
        title: "Group Chat Created",
        duration: 2000,
        status: "success",
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Error Occured",
        description: error.response.msg,
        duration: 2000,
        status: "error",
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const handleGroup = (userAdd) => {
    if (selectedUsers.includes(userAdd)) {
      return;
    }
    setSelectedUsers([userAdd, ...selectedUsers]);
  };
  const handleDelete = (userId) => {
    setSelectedUsers(
      selectedUsers.filter((seletedUser) => seletedUser._id !== userId)
    );
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="35px" display="flex" justifyContent="center">
            New Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add user"
                mb={3}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box display="flex" width="100%" flexWrap="wrap">
              {selectedUsers.map((user) => {
                return (
                  <UserBadge
                    user={user}
                    key={user._id}
                    handleFunction={() => handleDelete(user._id)}
                  />
                );
              })}
            </Box>
            {loading ? (
              <Spinner />
            ) : (
              searchResult?.slice(0, 4).map((user) => {
                return (
                  <UserList
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                );
              })
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="messenger" onClick={handleSubmit}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default GroupChatModal;
