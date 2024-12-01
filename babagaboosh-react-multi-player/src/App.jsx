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
import useTTS from "./useTTS";

const { TextArea } = Input;

const App = () => {
    const [input, setInput] = useState("");
    const [apiKeyPPLX, setApiKeyPPLX] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [gotUser2Ans, setGotUser2Ans] = useState(false);
    const [selectedMessageTTS, setSelectedMessageTTS] = useState();

    const inputRef = useRef(null);

    const submitNewInput = async (isLeftAns) => {
        setIsLoading(true);
        console.log(input);

        conversationMemory.splice(0, 2);

        conversationMemory.push({
            role: isLeftAns ? "user" : "assistant",
            content: isLeftAns
                ? input
                : conversationMemory[conversationMemory.length - 1].content,
        });

        chatHistory.push({
            id: new Date().getTime(),
            text: isLeftAns
                ? input
                : conversationMemory[conversationMemory.length - 1].content,
            user: {
                id: isLeftAns ? "user" : "assistant",
                name: isLeftAns ? "You" : "Pajama Sam",
            },
        });

        const options = createOptions(
            apiKeyPPLX,
            isLeftAns
                ? input
                : conversationMemory[conversationMemory.length - 1].content
        );
        console.log("options >>", options);

        try {
            const res = await fetch(
                "https://api.perplexity.ai/chat/completions",
                options
            );
            const resJson = await res.json();
            console.log("RES >>", resJson);

            let messageContent = resJson.choices[0].message.content;
            console.log("ANS >>", messageContent);

            messageContent = messageContent.replace(/\[\d+\]/g, "");

            conversationMemory.push({
                role: "assistant",
                content: messageContent,
            });

            chatHistory.push({
                id: new Date().getTime(),
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
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            if (event.shiftKey) {
                return;
            }

            if (!isLoading) {
                event.preventDefault();
                submitNewInput(true);
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

    useEffect(() => {
        const elements = document.querySelectorAll(".fade-animation");

        if (elements.length > 0) {
            elements[elements.length - 1].scrollIntoView({
                behavior: "smooth",
            });

            inputRef.current.focus();
        }

        if (elements.length % 2 === 1) {
            const newDiv = `
                <div class="tts-btn-${elements.length}"></div>
            `;

            elements[elements.length - 1].insertAdjacentHTML(
                "beforeend",
                newDiv
            );

            document
                .querySelector(`.tts-btn-${elements.length}`)
                .addEventListener("click", () => {
                    console.log("hi >>", elements.length);

                    const selectedMessageBox =
                        document.querySelectorAll(".sc-jlZhew")[
                            elements.length - 1
                        ];

                    // console.log(
                    //     "selectedMessageBox >>",
                    //     selectedMessageBox
                    // );

                    const selectedMessage =
                        selectedMessageBox.querySelector(
                            ".sc-iGgWBj"
                        ).textContent;

                    console.log("selectedMessage >>", selectedMessage);

                    setSelectedMessageTTS(selectedMessage);
                });
        }
    }, [chatHistory.length]);

    useTTS(selectedMessageTTS);

    useEffect(() => {
        console.log(">>", chatHistory.length);

        if (chatHistory.length % 2 === 1) {
            setInput("helloe");
        }
    }, [chatHistory.length]);

    // useEffect(() => {
    //     if (true) {
    //         // debugger;

    //         submitNewInput(false);
    //     }
    // }, [chatHistory.length]);

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
                                    ref={inputRef}
                                />

                                <Button
                                    type="primary"
                                    loading={isLoading}
                                    onClick={() => submitNewInput(true)}
                                    disabled={!input}
                                >
                                    Submit
                                </Button>
                            </Flex>

                            {/* <Button className="next-btn">Next Message</Button> */}
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
