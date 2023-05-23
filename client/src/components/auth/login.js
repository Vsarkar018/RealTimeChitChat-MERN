import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [showP, setShowP] = useState(0);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const Toast = useToast();
  const navigate = useNavigate();
  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      Toast({
        title: "Invalid Credentials",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    try {
      const { data } = await axios.post(
        "api/v1/user/login",
        { email, password },
      );
      Toast({
        title: "Login Successful",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo",JSON.stringify(data))
      setLoading(false)
    } catch (error) {
      console.log(error);
      setLoading(false)
      Toast({
        title: "Error Occured",
        description: error.response.data.msg,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const guestUserHandler = () => {};
  return (
    <VStack>
      <FormControl id="emaill" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="passwordd" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={showP ? "text" : "password"}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => setShowP(!showP)}>
              {showP ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        marginTop="15"
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
        colorScheme="green"
        width="100%"
        marginTop="15"
        onClick={guestUserHandler}
      >
        Guest User Login
      </Button>
    </VStack>
  );
};

export default Login;
