import { GoogleGenAI, Type } from "@google/genai";
import { Track } from '../types';

// Get API key from environment variables with proper React prefix
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey! });

export const generatePlaylistByMood = async (mood: string): Promise<Omit<Track, 'id' | 'url' | 'duration'>[]> => {
    if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
        throw new Error('Gemini API key not configured. Please set VITE_GEMINI_API_KEY in your .env.local file.');
    }
    
    try {
        const prompt = `Generate a playlist of 5 fictional songs for a "${mood}" mood, suitable for university students. Create unique song titles and artist names. Provide genres. Use picsum.photos for cover art.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        playlist: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    artist: { type: Type.STRING },
                                    genre: { type: Type.STRING },
                                    coverArt: { type: Type.STRING, description: "A URL from picsum.photos, e.g., https://picsum.photos/seed/example/200" }
                                }
                            }
                        }
                    }
                }
            }
        });

        const jsonStr = response.text.trim();
        const result = JSON.parse(jsonStr);
        return result.playlist;
    } catch (error) {
        console.error("Error generating playlist with Gemini:", error);
        throw new Error("Failed to generate AI playlist.");
    }
};
