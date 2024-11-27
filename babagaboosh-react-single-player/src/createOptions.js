import { conversationMemory } from "./conversationMemory";
import { systemMessage } from "./systemMessage";

const createMessage = () => {
    const message = [
        {
            role: "system",
            content: systemMessage,
        },
        ...conversationMemory,
    ];

    console.log(message);

    return message;
};

export const createOptions = (apiKeyPPLX, input) => {
    return {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKeyPPLX}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "llama-3.1-sonar-small-128k-online",
            messages: createMessage(),
            temperature: 0.7,
            top_p: 0.7,
            return_citations: false,
            // search_domain_filter: ["perplexity.ai"],
            return_images: false,
            return_related_questions: true,
            // search_recency_filter: "month",
            top_k: 10,
            stream: false,
            presence_penalty: 0.5,
            frequency_penalty: 1,
        }),
    };
};
