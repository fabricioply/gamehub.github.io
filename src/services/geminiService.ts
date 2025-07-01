import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Task } from '../types';

if (!process.env.API_KEY) {
  // In a real app, you might have a fallback or a more user-friendly message.
  // For this context, we will mock the API to avoid crashes if no key is present.
  console.warn("API_KEY environment variable is not set. Gemini features will be mocked.");
}

const ai = process.env.API_KEY ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;

const parseJsonResponse = <T,>(jsonString: string): T | null => {
    let cleanJsonString = jsonString.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = cleanJsonString.match(fenceRegex);
    if (match && match[2]) {
        cleanJsonString = match[2].trim();
    }
    
    try {
        return JSON.parse(cleanJsonString) as T;
    } catch (error) {
        console.error("Failed to parse JSON response:", error);
        return null;
    }
};

export const generateCreativeIdeas = async (task: Task): Promise<string[]> => {
  if (!ai) {
    return new Promise(resolve => setTimeout(() => resolve(["Mocked Idea: Consider a dynamic weather system.", "Mocked Idea: What if the character had a pet companion?", "Mocked Idea: Add a secret level accessible through an easter egg."]), 1000));
  }
  const prompt = `
    You are a creative assistant for a game development team.
    Based on the following task, generate 3 distinct and creative ideas to help the team.
    The ideas should be concise, actionable, and inspiring.
    Format the output as a JSON array of strings.

    Task Title: ${task.title}
    Task Description: ${task.description}
    Task Category: ${task.category}

    Example response:
    ["Idea 1...", "Idea 2...", "Idea 3..."]
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            temperature: 0.8,
        }
    });

    const ideas = parseJsonResponse<string[]>(response.text);
    return ideas || [];
  } catch (error) {
    console.error("Error generating creative ideas:", error);
    return [];
  }
};

export const enhanceDescription = async (title: string, description: string): Promise<string> => {
    if (!ai) {
      return new Promise(resolve => setTimeout(() => resolve("**Mocked AI Enhancement:**\n- Sub-task: Define asset requirements.\n- Acceptance: The feature works as described in the main ticket."), 1000));
    }
    const prompt = `
    You are an expert game producer. Your task is to enhance a task description to make it clearer and more comprehensive for a game development team.
    Given the task title and a brief description, expand on it by adding potential sub-tasks, acceptance criteria, or key considerations.
    Do not repeat the original title or description. Provide only the enhanced text.
    Keep it concise and formatted with markdown (e.g., using bullet points).

    Task Title: ${title}
    Original Description: ${description}
  `;

  try {
      const response: GenerateContentResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash-preview-04-17',
          contents: prompt,
          config: {
            temperature: 0.5,
          }
      });
      return response.text;
  } catch (error) {
      console.error("Error enhancing description:", error);
      return "Failed to enhance description.";
  }
};