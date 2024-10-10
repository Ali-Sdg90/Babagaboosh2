function submitQuery() {
    const userInput = document.getElementById("userInput").value;

    fetch("../config/config.json")
        .then((response) => response.json())
        .then((config) => {
            const apiKey = config.apiKey;
            // console.log("API Key:", apiKey);

            const options = {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "llama-3.1-sonar-small-128k-online",
                    messages: [
                        {
                            role: "system",
                            content:
                                "you are super angry. you hate everything and everyone and despise answering to anyone",
                        },
                        {
                            role: "user",
                            content: userInput,
                        },
                    ],
                    max_tokens: 20,
                    temperature: 0.2,
                    top_p: 0.9,
                    return_citations: true,
                    search_domain_filter: ["perplexity.ai"],
                    return_images: false,
                    return_related_questions: false,
                    search_recency_filter: "month",
                    top_k: 0,
                    stream: false,
                    presence_penalty: 0,
                    frequency_penalty: 1,
                }),
            };

            fetch("https://api.perplexity.ai/chat/completions", options)
                .then((response) => response.json())
                .then((response) => {
                    console.log("RES >>", response);

                    const messageContent = response.choices[0].message.content;

                    console.log("ANS >>", messageContent);

                    document.getElementById("output").textContent =
                        messageContent;
                })
                .catch((err) => console.error(err));
        });
}
