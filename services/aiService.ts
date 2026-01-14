
import { GoogleGenAI } from "@google/genai";
import { Task } from "../types";

export const generateNextSteps = async (tasks: Task[]): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
    
    const uncompletedP1 = tasks
      .filter(t => t.priority === 'P1')
      .flatMap(t => t.subtasks)
      .filter(st => !st.completed)
      .map(st => st.name);

    const prompt = `
      You are a Senior Product Manager for a Fitness App called GymTracker.
      Here is the list of remaining core features (P1 priority):
      ${uncompletedP1.join(', ')}

      Analyze these tasks and provide a short, motivating 2-3 sentence strategic advice on what the developer should focus on next to achieve a Minimum Viable Product (MVP).
      Be concise and technical.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Keep pushing! Focus on finishing the core P1 features to launch your MVP.";
  } catch (error) {
    console.error("AI Error:", error);
    return "The AI is currently resting. Focus on completing your highest priority tasks!";
  }
};
