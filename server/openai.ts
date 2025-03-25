import OpenAI from "openai";
import { PCBuilderRequirements } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "dummy-key-for-development" });

export type ComponentRecommendation = {
  name: string;
  description: string;
  price: string;
  image: string;
  id?: number;
};

export type PCBuildRecommendation = {
  purpose: string;
  analysis: string;
  components: ComponentRecommendation[];
  totalPrice: string;
  performanceRating: number;
  estimatedPowerDraw: string;
};

export async function generatePCBuildRecommendation(
  requirements: PCBuilderRequirements
): Promise<PCBuildRecommendation> {
  try {
    const prompt = `Generate a detailed PC build recommendation based on the following requirements:
      - Purpose: ${requirements.purpose}
      - Budget: ${requirements.budget}
      - Performance Level: ${requirements.performance}
      - Storage Needs: ${requirements.storage}
      - Monitor Resolution: ${requirements.resolution}
      - Additional Requirements: ${requirements.additionalRequirements || "None"}
      
      Provide a complete PC build recommendation with the following components:
      - CPU
      - GPU
      - Motherboard
      - RAM
      - Storage (SSD/HDD)
      - Power Supply
      - Case
      
      For each component, include:
      - Name
      - Brief description
      - Price (in USD)
      
      Also include:
      - A brief analysis explaining why this build is suitable for the specified purpose
      - Total price
      - Performance rating (a number from 1-5, where 5 is the highest)
      - Estimated power draw
      
      Format the response as a JSON object.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert PC builder with deep knowledge of computer components and their compatibility. Your task is to recommend an optimal PC build based on user requirements.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content || '{}';
    const result = JSON.parse(content);
    
    // Transform the AI response into our expected format
    const recommendation: PCBuildRecommendation = {
      purpose: requirements.purpose,
      analysis: result.analysis || "Based on your requirements, we've created an optimized build.",
      components: result.components || [],
      totalPrice: result.totalPrice || "0.00",
      performanceRating: result.performanceRating || 3,
      estimatedPowerDraw: result.estimatedPowerDraw || "Unknown",
    };

    return recommendation;
  } catch (error: any) {
    console.error("Error generating PC build recommendation:", error);
    
    // Check for rate limit error
    if (error?.status === 429 || (error?.error && error?.error?.type === 'insufficient_quota')) {
      throw new Error('API_RATE_LIMIT_EXCEEDED');
    }
    
    // Fallback recommendations for other types of errors
    return {
      purpose: requirements.purpose,
      analysis: "Unable to generate AI recommendation. Here are some general recommendations based on your requirements.",
      components: [
        {
          name: "AMD Ryzen 7 5800X",
          description: "8-core processor, excellent for gaming and multi-tasking",
          price: "369.99",
          image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        },
        {
          name: "NVIDIA GeForce RTX 3070",
          description: "High-performance GPU for 1440p gaming",
          price: "599.99",
          image: "https://images.unsplash.com/photo-1587202372634-32705e3bf899?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        },
        {
          name: "MSI MAG B550 TOMAHAWK",
          description: "Reliable motherboard with good VRMs for gaming builds",
          price: "179.99",
          image: "https://images.unsplash.com/photo-1592664474496-8b8c0ef2cbf8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        },
      ],
      totalPrice: "1749.95",
      performanceRating: 4,
      estimatedPowerDraw: "550W",
    };
  }
}
