import React, { useRef, useState, useEffect, useCallback } from "react";
import { Mic, MicOff, Upload } from "lucide-react";

const VoiceTextRenderer = () => {
  const [content, setContent] = useState(""); // All spoken text
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [images, setImages] = useState([]); // Array of uploaded images
  const [isListening, setIsListening] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  const speak = useCallback((message) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const handleVoiceResult = useCallback(
    (spokenText) => {
      setCurrentTranscript(spokenText);

      // Check if user wants to upload an image
      if (
        spokenText.toLowerCase().includes("upload image") ||
        spokenText.toLowerCase().includes("add image")
      ) {
        speak("Opening image picker");
        fileInputRef.current?.click();
        return;
      }

      // Otherwise, add the spoken text to content
      setContent((prev) => {
        const newContent = prev ? `${prev}\n\n${spokenText}` : spokenText;
        return newContent;
      });

      speak("Text added");
    },
    [speak]
  );

  const startListening = useCallback(() => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      setStatusMessage("Speech recognition not supported in this browser");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false; // Single recording session
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setCurrentTranscript("");
      setStatusMessage("Listening... Speak now");
    };

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript.trim();
      handleVoiceResult(spokenText);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setStatusMessage(`Error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setStatusMessage("Recording stopped. Click to record again.");
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [handleVoiceResult]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setImages((prev) => [
      ...prev,
      {
        url: imageUrl,
        name: file.name,
        id: Date.now(),
      },
    ]);

    speak("Image uploaded successfully");
    setStatusMessage("Image added to content");
  };

  const clearAll = () => {
    setContent("");
    setImages([]);
    setCurrentTranscript("");
    setStatusMessage("All content cleared");
    speak("All content cleared");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Voice Text Renderer
        </h2>
        <div className="flex gap-3">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              isListening
                ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}>
            {isListening ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
            {isListening ? "Stop Recording" : "Start Recording"}
          </button>

          <button
            onClick={clearAll}
            className="px-4 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors">
            Clear All
          </button>
        </div>
      </div>

      {/* Status Message */}
      {statusMessage && (
        <div
          className={`p-3 rounded-lg mb-4 ${
            statusMessage.includes("Error") || statusMessage.includes("error")
              ? "bg-red-100 text-red-700"
              : statusMessage.includes("success") ||
                statusMessage.includes("added")
              ? "bg-green-100 text-green-700"
              : "bg-blue-100 text-blue-700"
          }`}>
          {statusMessage}
        </div>
      )}

      {/* Current Recording Display */}
      {isListening && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="font-medium text-yellow-800">
              Recording in progress...
            </span>
          </div>
          {currentTranscript && (
            <p className="text-yellow-700 italic">"{currentTranscript}"</p>
          )}
        </div>
      )}

      {/* Rendered Content Area */}
      <div className="min-h-96 p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
        {!content && images.length === 0 ? (
          <div className="text-center text-gray-500">
            <p className="text-lg mb-2">No content yet</p>
            <p className="text-sm">
              Click "Start Recording" and speak to add text content
            </p>
            <p className="text-sm">Say "upload image" to add images</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Render Text Content */}
            {content && (
              <div className="prose max-w-none">
                {content.split("\n\n").map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-gray-800 text-lg leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}

            {/* Render Images */}
            {images.map((image) => (
              <div
                key={image.id}
                className="border border-gray-200 rounded-lg p-4 bg-white">
                <img
                  src={image.url}
                  alt={image.name}
                  className="max-w-full h-auto rounded-lg shadow-sm"
                  style={{ maxHeight: "400px" }}
                />
                <p className="text-sm text-gray-500 mt-2">{image.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">How to use:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>
            • Click "Start Recording" and speak - your words will be added as
            text
          </li>
          <li>• Say "upload image" during recording to add an image</li>
          <li>• Each recording session adds new content</li>
          <li>• Use "Clear All" to start over</li>
        </ul>
      </div>
    </div>
  );
};

export default VoiceTextRenderer;
