import React, { useEffect, useState } from "react";
import {
    MinChatUiProvider,
    MainContainer,
    MessageContainer,
    MessageList,
} from "@minchat/react-chat-ui";

import { Button, Flex, Input, Spin } from "antd";
import { chatHistory } from "./chatHistory";
const { TextArea } = Input;

const App = () => {
    const [input, setInput] = useState("");
    const [apiKeyPPLX, setApiKeyPPLX] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const submitNewInput = () => {
        if (input) {
            setIsLoading(true);

            console.log(input);

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
                                Chat With Raily
                            </Flex>

                            <MessageList
                                className="chat-list"
                                messages={chatHistory}
                                currentUserId="user1"
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
