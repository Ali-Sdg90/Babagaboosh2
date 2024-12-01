import { useState, useEffect } from "react";

const useTTS = (text) => {
    const [rate] = useState(1); // Default rate
    const [pitch] = useState(1.6); // Default pitch
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);

    // Fetch available voices and set default voice
    useEffect(() => {
        const fetchVoices = () => {
            const availableVoices = speechSynthesis.getVoices();
            setVoices(availableVoices);

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

    // Trigger speech synthesis when text changes
    useEffect(() => {
        if (text && selectedVoice) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = rate;
            utterance.pitch = pitch;

            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }

            speechSynthesis.cancel();
            speechSynthesis.speak(utterance);
        }
    }, [text, selectedVoice, rate, pitch]);
};

export default useTTS;
