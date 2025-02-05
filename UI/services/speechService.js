import { getAuthToken, apiBaseURL } from "../config/apiConfig";

/**
 * Starts recording audio using the MediaRecorder API.
 * @returns {Object} An object containing the mediaRecorder instance and an array to store audio chunks.
 */
export const startRecording = async () => {
  try {
    // Request microphone access
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // Create a MediaRecorder instance to handle recording
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    mediaRecorder.start();
    return { mediaRecorder, audioChunks };
  } catch (error) {
    console.error("Error accessing microphone:", error);
    return { mediaRecorder: null, audioChunks: [] };
  }
};

/**
 * Stops recording, processes the audio data, and sends it to the API for transcription.
 * @param {MediaRecorder} mediaRecorder - The MediaRecorder instance handling the recording.
 * @param {Array} audioChunks - The array storing recorded audio chunks.
 * @param {Function} onTranscribe - Callback function to handle the transcription result.
 * @param {Function} setLoading - Function to update the UI loading state.
 */

export const stopRecording = async (mediaRecorder, audioChunks, onTranscribe, setLoading) => {
  if (!mediaRecorder) return;

  mediaRecorder.stop();
  mediaRecorder.onstop = async () => {
    const audioBlob = new Blob(audioChunks, { type: "audio/webm" }); 
    const arrayBuffer = await audioBlob.arrayBuffer();

    try {
      // Indicate processing state to the UI
      setLoading(true);
      const authToken = await getAuthToken();

      // Send audio data to the backend for speech-to-text conversion
      const response = await fetch(`${apiBaseURL}/speech-to-text`, {
        method: "POST",
        headers: {
          Authorization: authToken,
          "Content-Type": "audio/webm",
        },
        body: arrayBuffer,
      });

      const result = await response.json();
      const parsedBody = JSON.parse(result.body);
      console.log(parsedBody.transcription)
      if (parsedBody.transcription) {
        onTranscribe(parsedBody.transcription);
      }
    } catch (error) {
      console.error("Error transcribing audio:", error);
    }
    finally {
      setLoading(false);
    }
  };
};
