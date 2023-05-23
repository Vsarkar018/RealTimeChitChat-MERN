import React from "react";
import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import Login from "../components/auth/login";
import Signup from "../components/auth/signup";
const Home = () => {
  return (
    <Container maxWidth="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        padding={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl">Real-Time-Chit-Chat</Text>
      </Box>
      <Box
        bg="white"
        width="100%"
        padding={4}
        borderRadius="lg"
        borderWidth="1px"

      >
        <Tabs variant="soft-rounded" >
          <TabList mb='1em'>
            <Tab width='50%'>Login</Tab>
            <Tab width='50%'>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login/>
            </TabPanel>
            <TabPanel>
              <Signup/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Home;
