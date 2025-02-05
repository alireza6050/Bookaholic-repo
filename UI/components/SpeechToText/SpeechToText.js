import React, { useState, useRef } from "react";
import { startRecording, stopRecording } from "../../services/speechService";
import "./SpeechToText.css"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faCircle } from "@fortawesome/free-solid-svg-icons";
import Loader from "../Loader/Loader";

/**
 * SpeechToText Component
 * Allows users to record audio and transcribes it using the speech-to-text API.
 * 
 * @param {Function} onTranscribe - Callback function to handle transcribed text.
 */

function SpeechToText({ onTranscribe }) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [loading, setLoading] = useState(false);

    /**
   * Handles starting the recording process.
   * Uses the startRecording() function to access the microphone and store the recorder instance.
   */
  const handleStartRecording = async () => {
    const { mediaRecorder, audioChunks } = await startRecording();
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = audioChunks;
    setIsRecording(true);
  };
  
  /**
   * Handles stopping the recording process.
   * Calls stopRecording() and triggers transcription.
   */
  const handleStopRecording = async () => {
    setIsRecording(false);
    setLoading(true); 
    await stopRecording(mediaRecorderRef.current, audioChunksRef.current, onTranscribe, setLoading);
  };

  return (
    <div className="speech-container">
    <Loader isLoading={loading} message="Transcribing your speech..." /> 

    <button
      type="button" 
      className={`mic-button ${isRecording ? "recording" : ""}`}
      onClick={isRecording ? handleStopRecording : handleStartRecording}
    >
      {isRecording ? (
        <FontAwesomeIcon icon={faCircle} className="recording-icon" />
      ) : (
        <FontAwesomeIcon icon={faMicrophone} className="mic-icon" />
      )}
    </button>
    </div>
  );
}

export default SpeechToText;
