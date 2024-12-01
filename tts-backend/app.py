from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from TTS.api import TTS

app = Flask(__name__)
CORS(app)  # Allow requests from React

# Initialize the TTS model
tts = TTS(model_name="tts_models/en/ljspeech/tacotron2-DDC", progress_bar=False, gpu=False)

@app.route("/synthesize", methods=["POST"])
def synthesize():
    data = request.json
    text = data.get("text", "")
    output_path = "output.wav"

    if not text:
        return jsonify({"error": "No text provided"}), 400

    # Synthesize speech
    tts.tts_to_file(text=text, file_path=output_path)
    return send_file(output_path, mimetype="audio/wav")

if __name__ == "__main__":
    app.run(port=5000)
