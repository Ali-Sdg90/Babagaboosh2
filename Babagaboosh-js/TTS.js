const ttsTest = async (messageContent) => {
    const ttsRes = await fetch("../config/config.json");
    const TTSApiKeyJSON = await ttsRes.json();
    const TTSApiKey = TTSApiKeyJSON.TTSApiKey;

    const url = `https://text-to-speach-english.p.rapidapi.com/makevoice?text=${messageContent}`;
    const options = {
        method: "POST",
        headers: {
            "x-rapidapi-key": TTSApiKey,
            "x-rapidapi-host": "text-to-speach-english.p.rapidapi.com",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            key1: "value",
            key2: "value",
        }),
    };

    try {
        const response = await fetch(url, options);
        const blob = await response.blob(); // Convert response to blob for audio
        const audioUrl = URL.createObjectURL(blob); // Create object URL for the audio file

        // Set the audio URL to the audio player
        const audioPlayer = document.getElementById("audio-player");
        audioPlayer.src = audioUrl;
        audioPlayer.play(); // Play the audio

        console.log("Audio is playing...");
    } catch (error) {
        console.error(error);
    }
};
