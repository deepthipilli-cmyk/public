import { GoogleGenAI } from "@google/genai";

export async function onRequestPost(context: any) {
  const { request, env } = context;
  try {
    const { location, current, daily } = await request.json();
    
    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Gemini API key is not configured." }), { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'cloudflare-pages',
        }
      }
    });
    
    const prompt = `
      You are an intelligent weather assistant. Provide simple, practical planning recommendations based on the following weather data for ${location}.
      
      Current Weather:
      - Temperature: ${current.temperature}°C
      - Conditions: ${current.condition}
      - Wind Speed: ${current.windSpeed} km/h

      Forecast Highlights (Next 7 days):
      ${daily.map((day: any) => `- ${day.date}: ${day.condition}, Max ${day.maxTemp}°C, Min ${day.minTemp}°C`).join('\n')}
      
      Provide a short 2-3 paragraph summary recommending what to wear, if they need an umbrella, and any outdoor activity suggestions. Keep it friendly and concise.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    return new Response(JSON.stringify({ recommendation: response.text }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return new Response(JSON.stringify({ error: "Failed to generate recommendations." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
