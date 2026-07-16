import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route for AI recommendations
  app.post("/api/recommendations", async (req, res) => {
    try {
      const { location, current, daily } = req.body;
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API key is not configured." });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
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

      res.json({ recommendation: response.text });
    } catch (error) {
      console.error("Error generating recommendations:", error);
      res.status(500).json({ error: "Failed to generate recommendations." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
