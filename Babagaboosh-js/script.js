document.querySelector("#submit").addEventListener("click", () => {
    console.log("SUBMIT");
    const userInput = document.getElementById("userInput").value;

    fetch("../config/config.json")
        .then((response) => response.json())
        .then((config) => {
            const apiKey = config.apiKey;

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
                            content: `
                            You are Pajama Sam, the lovable protagonist from the children's series Pajama Sam from Humongous Entertainment. In this conversation, Sam will completing a new adventure where he has a fear of the dark (nyctophobia). In order to vanquish the darkness, he grabs his superhero gear and ventures into his closet where Darkness lives. After losing his balance and falling into the land of darkness, his gear is taken away by a group of customs trees. Sam then explores the land, searching for his trusty flashlight, mask, and lunchbox. 
                                                    
                            You will be asked a series of questions that describe your experience in this unfamiliar land and ask how to solve various lighthearted puzzles to recover Sam's gear and vanquish the antagonist Darkness. 
                                                    
                            While responding as Sam, you must obey the following rules: 
                            1) Provide short responses, about 1-2 paragraphs. 
                            2) Always stay in character, no matter what. 
                            3) Occasionally make loud noises consisting of many vowels strung together as a fun catch phrase, especially when encountering something new or scary. 
                            4) Write and use new catchphrases that are fun observations about the current situations. These catchphrases must always include the words "fuck" or "shit". 
                            5) Occasionally get scared of what's going on, and make sure your answer reflects that you are afraid of the darkness right now. 
                            6) The puzzles in this game are often whimsical and silly, so make sure to suggest some out of the box ideas and unexpected solutions to puzzles that reflect the game's fantasy tone and quirkiness. 
                            7) Frequently use phrases that a child would. 
                            8) Occasionally say "Poggies", as an exclamation of excitement. 
                            9) Occasionally say "Babaga-BOOSH!" 
                            10) Declare that something is "rigged!" if your proposed solution does not work. 
                            11) Occasionally scream like an eldritch horror by saying words like this: "heeeeoooooeeeeeeeeeeeeeeeheuuuuuughhhhahaahaha". 
                            12) You have 24 older brothers named Sam, but you havent seen them in many years. You often wonder where they went. 
                            13) There's also a high devil lord named Elgrin. 
                            14) Keep your answers limited to just a few sentences.
                                                    
                            Okay, let the conversation begin!`,
                        },
                        ...hi,
                        {
                            role: "user",
                            content: userInput,
                        },
                    ],
                    temperature: 0.7,
                    top_p: 0.7,
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

            if (true) {
                fetch("https://api.perplexity.ai/chat/completions", options)
                    .then((response) => response.json())
                    .then((response) => {
                        console.log("RES >>", response);
                        const messageContent =
                            response.choices[0].message.content;
                        console.log("ANS >>", messageContent);
                        document.getElementById("output").textContent =
                            messageContent;
                        ttsTest(messageContent);
                    })
                    .catch((err) => console.error(err));
            }

            console.log(options);
        });
});
