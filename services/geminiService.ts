import { GoogleGenAI, Modality } from "@google/genai";

// Initialize the client once at the module level.
// This is more efficient than creating it on every request.
const API_KEY = process.env.API_KEY;
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

if (!ai) {
  console.warn("API_KEY environment variable is not set. The app will not function correctly.");
}

const model = 'gemini-2.5-flash-image';

const processImage = async (base64ImageData: string, mimeType: string, prompt: string): Promise<string> => {
  // Provide a clear error message if the API key is missing.
  // This is the most likely cause of failure in a deployed environment like Vercel.
  if (!ai) {
    throw new Error("Gemini API key not configured. Please set the API_KEY environment variable in your deployment settings.");
  }
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });
    
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    throw new Error("No image data found in the Gemini API response.");

  } catch (error) {
    console.error("Error processing image with Gemini:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('API key not valid')) {
        throw new Error("The configured API key is invalid. Please check your configuration.");
    }
    // Re-throw a generic error for other API issues.
    throw new Error("Failed to process image with the AI model. Please try again.");
  }
};

export const removeBackground = async (base64ImageData: string, mimeType: string): Promise<string> => {
  const prompt = "Remove the background of this image perfectly. The new background must be transparent. Output a PNG file.";
  return processImage(base64ImageData, mimeType, prompt);
};

export const editImageWithPrompt = async (base64ImageData: string, mimeType: string, prompt: string): Promise<string> => {
  if (!prompt.trim()) {
    return Promise.reject(new Error("Prompt cannot be empty."));
  }
  return processImage(base64ImageData, mimeType, prompt);
};

export const addBackgroundColor = async (base64ImageData: string, mimeType: string, color: string): Promise<string> => {
  const prompt = `First, perfectly remove the original background. Then, create a new background that is a solid color: ${color}. Make sure the subject is perfectly preserved. Output a PNG file.`;
  return processImage(base64ImageData, mimeType, prompt);
};