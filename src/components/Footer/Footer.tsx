import {
  Box,
  chakra,
  Container,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  SimpleGrid,
  Stack,
  Text,
  VisuallyHidden,
} from "@chakra-ui/react";
import { useState, type ReactNode } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
  MessageModel,
} from "@chatscope/chat-ui-kit-react";
import { ChatIcon } from "@chakra-ui/icons";
import { MessageDirection } from "@chatscope/chat-ui-kit-react/src/types/unions";

const Logo = (props: any) => {
  return (
    <Image
      h={8}
      cursor="pointer"
      objectFit={"contain"}
      alt={"FreLan"}
      src={"/images/logo/logo.png"}
      {...props}
    />
  );
};

export default function LargeWithNewsletter() {
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };

  // const systemMessage = {
  //   role: "system",
  //   content:
  //     "Explain things like you're talking to a software professional with 2 years of experience.",
  // };

  // const [messages, setMessages] = useState([
  //   {
  //     message: "Hello, I'm ChatGPT! Ask me anything!",
  //     // sentTime: "just now",
  //     sender: "ChatGPT",
  //     direction: "incoming" as MessageDirection,
  //     position: "first" as MessageModel["position"],
  //   },
  // ]);

  // const handleSendMessage = async (message: string) => {
  //   const newMessages = {
  //     direction: "outgoing" as MessageDirection,
  //     message: message,
  //     sender: "User",
  //     position: "last" as MessageModel["position"],
  //   };
  //   const newMessages2 = [...messages, newMessages];
  //   setMessages(newMessages2);
  //   setIsTyping(true);

  //   await getResponseFromChatGPT(newMessages2);
  // };

  // async function getResponseFromChatGPT(chatMessages: any) {
  //   let apiMessages = chatMessages.map((messageObject: any) => {
  //     let role = "";
  //     if (messageObject.sender === "ChatGPT") {
  //       role = "assistant";
  //     } else {
  //       role = "user";
  //     }
  //     return { role: role, content: messageObject.message };
  //   });

  //   const apiRequestBody = {
  //     model: "gpt-3.5-turbo",
  //     messages: [
  //       systemMessage, // The system message DEFINES the logic of our chatGPT
  //       ...apiMessages, // The messages from our chat with ChatGPT
  //     ],
  //   };

  //   try {
  //     const response = await fetch(
  //       "https://api.openai.com/v1/chat/completions",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${API_KEY_GPT_1}`,
  //         },
  //         body: JSON.stringify(apiRequestBody),
  //       }
  //     );
  //     const data = await response.json();
  //     if (data?.choices?.[0]?.message?.content) {
  //       setMessages([
  //         ...chatMessages,
  //         {
  //           message: data.choices[0].message.content,
  //           sender: "ChatGPT",
  //         },
  //       ]);
  //     } else {
  //       console.error("No response from API");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data from API:", error);
  //   } finally {
  //     setIsTyping(false);
  //   }
  // }

  return (
    <Box
      color={"brand.slate.500"}
      bg={"white"}
      borderTop="1px solid"
      borderTopColor="blackAlpha.200"
      h="full"
    >
      <Container w="full" py={12}>
        <SimpleGrid
          templateColumns={{ sm: "1fr 1fr", md: "3fr 1fr 1fr" }}
          spacing={8}
        >
          <Stack mr={{ base: 0, md: 32 }} spacing={6}>
            <Box>
              <Logo color={"brand.slate.500"} />
            </Box>
            <Text color="brand.slate.500">
              © 2023 frelan. All rights reserved.
            </Text>
          </Stack>
          <div className="cursor-pointer">
            <ChatIcon
              onClick={() => {
                setIsOpen(true);
              }}
              w={8}
              h={8}
            />
          </div>
        </SimpleGrid>
      </Container>
      {/* <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent maxW={"607px"} py={"1.4375rem"}>
          <ModalBody>
            <div
              style={{ position: "relative", height: "500px", width: "500px" }}
            >
              <MainContainer>
                <ChatContainer>
                  <MessageList
                    typingIndicator={
                      isTyping ? (
                        <TypingIndicator content="Chat GPT đang nhập" />
                      ) : null
                    }
                  >
                    {messages.map((message, i) => {
                      return <Message key={i} model={message} />;
                    })}
                  </MessageList>
                  <MessageInput
                    placeholder="Type message here"
                    onSend={handleSendMessage}
                  />
                </ChatContainer>
              </MainContainer>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal> */}
    </Box>
  );
}
