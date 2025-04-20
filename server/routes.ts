import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { bookResponseSchema } from "@shared/schema";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { recommendBooks } from "./books";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up Google Generative AI
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
  if (!apiKey) {
    console.warn("Warning: No Gemini API key found. AI recommendations will not work.");
  }
  
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  // Book recommendation endpoint
  app.post("/api/recommend", async (req, res) => {
    try {
      // Validate request body
      const schema = z.object({
        query: z.string().min(1).max(500),
      });
      
      const validatedData = schema.parse(req.body);
      const { query } = validatedData;
      
      // Get book recommendations based on user query
      const books = await recommendBooks(query, model);
      
      // Validate the response structure
      const response = bookResponseSchema.parse({ books });
      
      res.json(response);
    } catch (error) {
      console.error("Error in /api/recommend:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid input data", 
          details: error.errors 
        });
      }
      
      res.status(500).json({ 
        message: "Failed to get book recommendations",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
