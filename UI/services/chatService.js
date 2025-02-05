import { getAuthToken, apiBaseURL } from "../config/apiConfig";

/**
 * Sends a user query to the AI-powered book search API.
 * Handles chat responses as well as book search results.
 * 
 * @param {string} userInput - The query entered by the user.
 * @returns {Promise<Object>} - The API response, either a chat response or a list of books.
 */
export const sendMessageToAI = async (userInput) => {
  try {
    // Retrieve authentication token
    const authToken = await getAuthToken();

    const requestBody = {
        body: JSON.stringify({ query: userInput.trim() })
    };
    console.log("API Call Request Body:", JSON.stringify(requestBody)); 

    // Send request to the book-search API endpoint
    const response = await fetch(`${apiBaseURL}/book-search`, {
        method: "POST",
        headers: {
          Authorization: authToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
  
      const responseData = await response.json();
      console.log("API Response:", responseData);
  
      let parsedBody;
      try {
        parsedBody = JSON.parse(responseData.body);
      } catch (error) {
        throw new Error("Error parsing response body: " + error.message);
      }

      // Handle chat response from API
      if (parsedBody["chat-response"]) {
        return { response: parsedBody["chat-response"] }; 
      }
      // Handle book response form API
      else if (parsedBody.books && Array.isArray(parsedBody.books)) {
        const parsedBooks = parsedBody.books.map(book => ({
            title: book.title || "Unknown Title",
            author: book.author || "Unknown Author",
            summary: book.summary || "No summary available."
        }));
    
        return { response: parsedBooks };
    }
  
    } catch (error) {
      console.error("Error sending chat message:", error);
      return [{ title: "Error", author: "", summary: "Sorry, an error occurred while searching." }];
    }
  };