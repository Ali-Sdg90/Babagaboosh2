import React, { useEffect, useState, useRef } from "react";
import {
    MinChatUiProvider,
    MainContainer,
    MessageContainer,
    MessageList,
} from "@minchat/react-chat-ui";

import { Button, Flex, Input, Spin } from "antd";
import { chatHistory } from "./chatHistory";
import { conversationMemory } from "./conversationMemory";
import { createOptions } from "./createOptions";
import { marked } from "marked";

const { TextArea } = Input;

const App = () => {
    const [input, setInput] = useState("");
    const [apiKeyPPLX, setApiKeyPPLX] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messageListRef = useRef(null); 

    const submitNewInput = async () => {
        if (input) {
            setIsLoading(true);
            console.log(input);

            conversationMemory.splice(0, 2);

            conversationMemory.push({
                role: "user",
                content: input,
            });

            chatHistory.push({
                id: new Date().getTime(),
                text: input,
                user: {
                    id: "user",
                    name: "You",
                },
            });

            const options = createOptions(apiKeyPPLX, input);
            console.log("options >>", options);

            try {
                const res = await fetch(
                    "https://api.perplexity.ai/chat/completions",
                    options
                );
                const resJson = await res.json();
                console.log("RES >>", resJson);

                const messageContent = resJson.choices[0].message.content;
                console.log("ANS >>", messageContent);

                conversationMemory.push({
                    role: "assistant",
                    content: messageContent,
                });

                chatHistory.push({
                    id: new Date().getTime(),
                    // text: `<pre>${messageContent}</pre>`,
                    text: marked(messageContent),
                    user: {
                        id: "sam",
                        name: "Pajama Sam",
                        avatar: "./Pajama_Sam.webp",
                    },
                });
            } catch (error) {
                console.log("ERROR >>", error);
            }

            // console.log("conversationMemory >>", conversationMemory);

            setInput("");
            setIsLoading(false);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            if (event.shiftKey) {
                return;
            }

            if (!isLoading) {
                event.preventDefault();
                submitNewInput();
            }
        }
    };

    const inputChangeHandler = (e) => {
        if (!isLoading) {
            setInput(e.target.value);
        }
    };

    useEffect(() => {
        const getApiKey = async () => {
            try {
                const res = await fetch("/config.json");
                if (!res.ok) {
                    throw new Error("Failed to fetch config");
                }
                const resJson = await res.json();
                setApiKeyPPLX(resJson.apiKey);
            } catch (error) {
                console.error("Error fetching config:", error);
            }
        };

        getApiKey();
    }, []);

    // need work...
    useEffect(() => {
        const element = document.querySelector(".fpeuA-D");
        console.log(element);

        if (element) {
            element.scrollTop = element.scrollHeight;
        }
    }, [chatHistory]);

    return (
        <>
            {apiKeyPPLX ? (
                <MinChatUiProvider theme="#6ea9d7">
                    <MainContainer style={{ height: "100vh" }}>
                        <MessageContainer>
                            <Flex
                                className="chat-header"
                                justify="center"
                                align="center"
                            >
                                Chat With Pajama Sam
                            </Flex>

                            <MessageList
                                className="chat-list"
                                messages={chatHistory}
                                currentUserId="user"
                            />

                            <Flex
                                className="input-section"
                                align="flex-end"
                                gap={10}
                            >
                                <TextArea
                                    placeholder="Type here"
                                    autoSize={{
                                        minRows: 1,
                                        maxRows: 6,
                                    }}
                                    value={input}
                                    onChange={(e) => inputChangeHandler(e)}
                                    onKeyDown={handleKeyPress}
                                    disabled={isLoading}
                                />

                                <Button
                                    type="primary"
                                    loading={isLoading}
                                    onClick={submitNewInput}
                                    disabled={!input}
                                >
                                    Submit
                                </Button>
                            </Flex>
                        </MessageContainer>
                    </MainContainer>
                </MinChatUiProvider>
            ) : (
                <Spin size="large" className="loading-token-spinner" />
            )}
        </>
    );
};

export default App;
