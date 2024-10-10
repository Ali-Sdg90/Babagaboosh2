/**
 * Function to handle the submission of the user's query.
 * It fetches the API key from the config file, constructs the request options,
 * sends the request to the API, and handles the response.
 */
function submitQuery() {
    // Get the user input from the input field
    const userInput = document.getElementById("userInput").value;

    // Fetch the API key from the config file
    fetch("../config/config.json")
        .then((response) => response.json())
        .then((config) => {
            const apiKey = config.apiKey;

            // Construct the request options
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

            // Send the request to the API
            fetch("https://api.perplexity.ai/chat/completions", options)
                .then((response) => response.json())
                .then((response) => {
                    // Handle the API response
                    console.log("RES >>", response);

                    const messageContent = response.choices[0].message.content;

                    console.log("ANS >>", messageContent);

                    // Display the response message content in the output element
                    document.getElementById("output").textContent =
                        messageContent;
                })
                .catch((err) => console.error(err));
        });
}
