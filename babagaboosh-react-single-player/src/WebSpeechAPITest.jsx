import React, { useState, useEffect } from "react";

const WebSpeechAPIWithVoiceChange = () => {
    const [text, setText] = useState("");
    const [rate, setRate] = useState(1);
    const [pitch, setPitch] = useState(1.6);
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);

    useEffect(() => {
        const fetchVoices = () => {
            const availableVoices = speechSynthesis.getVoices();
            setVoices(availableVoices);

            // Default: Select first female English voice
            const femaleVoice = availableVoices.find(
                (voice) =>
                    voice.lang.includes("en") &&
                    voice.name.toLowerCase().includes("female")
            );
            setSelectedVoice(femaleVoice || availableVoices[2]);
        };

        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = fetchVoices;
        }

        fetchVoices();
    }, []);

    const handleSpeak = () => {
        if (!text) {
            alert("Please enter some text!");
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = rate;
        utterance.pitch = pitch;

        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        console.log("Selected Voice:", selectedVoice);

        speechSynthesis.cancel(); // Clear existing speech
        speechSynthesis.speak(utterance); // Start speaking
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial" }}>
            <h2>Text-to-Speech Example with Voice Selection</h2>
            <textarea
                rows="4"
                cols="50"
                placeholder="Enter text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{ width: "100%", marginBottom: "10px" }}
            ></textarea>

            <div style={{ marginBottom: "10px" }}>
                <label>
                    <strong>Rate (Speed):</strong> {rate}
                    <input
                        type="range"
                        min="0.1"
                        max="2"
                        step="0.1"
                        value={rate}
                        onChange={(e) => setRate(Number(e.target.value))}
                        style={{ marginLeft: "10px" }}
                    />
                </label>
            </div>

            <div style={{ marginBottom: "10px" }}>
                <label>
                    <strong>Pitch:</strong> {pitch}
                    <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={pitch}
                        onChange={(e) => setPitch(Number(e.target.value))}
                        style={{ marginLeft: "10px" }}
                    />
                </label>
            </div>

            <div style={{ marginBottom: "10px" }}>
                <label>
                    <strong>Select Voice:</strong>
                    <select
                        value={selectedVoice ? selectedVoice.name : ""}
                        onChange={(e) =>
                            setSelectedVoice(
                                voices.find((v) => v.name === e.target.value)
                            )
                        }
                        style={{ marginLeft: "10px" }}
                    >
                        {voices.map((voice, index) => (
                            <option key={index} value={voice.name}>
                                {voice.name} ({voice.lang})
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <button
                onClick={handleSpeak}
                style={{ padding: "10px 20px", cursor: "pointer" }}
            >
                Speak
            </button>
        </div>
    );
};

export default WebSpeechAPIWithVoiceChange;
