import React, { useEffect, useState } from "react";
import {
    MinChatUiProvider,
    MainContainer,
    MessageContainer,
    MessageList,
} from "@minchat/react-chat-ui";

import { Button, Flex, Input } from "antd";
const { TextArea } = Input;

const App = () => {
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const sampleMessages = [
        {
            id: "1",
            text: "Hello! How are you doing today?",
            user: {
                id: "user1",
                name: "User One",
                avatar: "https://files.bos-fahrzeuge.info/vehicles/photos/b/b/1/3/283567-large.jpg",
            },
            timestamp: new Date().toISOString(),
        },
        {
            id: "2",
            text: "I'm doing great, thanks! How about you?",
            user: {
                id: "user2",
                name: "User Two",
                avatar: "https://files.bos-fahrzeuge.info/vehicles/photos/b/b/1/3/283567-large.jpg",
            },
            timestamp: new Date().toISOString(),
        },
        {
            id: "3",
            text: "I'm also well. Have you started working on the project?",
            user: {
                id: "user1",
                name: "User One",
            },
            timestamp: new Date().toISOString(),
        },
        {
            id: "4",
            text: "Yes, I have. I made some good progress yesterday.",
            user: {
                id: "user2",
                name: "User Two",
            },
            timestamp: new Date().toISOString(),
        },
        {
            id: "5",
            text: "Yes, I have. I made some good progress yesterday.",
            user: {
                id: "user0",
                name: "User Two",
            },
            timestamp: new Date().toISOString(),
        },
    ];

    const submitNewInput = () => {
        console.log(input);

        setInput("");
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            if (event.shiftKey) {
                return;
            }

            event.preventDefault();
            submitNewInput();
        }
    };

    return (
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
                        messages={sampleMessages}
                        currentUserId="user1"
                    />

                    <Flex className="input-section" align="flex-end" gap={10}>
                        <TextArea
                            placeholder="Type here"
                            autoSize={{
                                minRows: 1,
                                maxRows: 6,
                            }}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                        />

                        <Button
                            type="primary"
                            loading={isLoading}
                            onClick={submitNewInput}
                        >
                            Submit
                        </Button>
                    </Flex>
                </MessageContainer>
            </MainContainer>
        </MinChatUiProvider>
    );
};

export default App;
