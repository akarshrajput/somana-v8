import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Access your API key as an environment variable
const api_key = process.env.GEMINI_API_KEY;

if (!api_key) {
  throw new Error("Please set the API_KEY environment variable.");
}

// Initialize the GoogleGenerativeAI client
const genAI = new GoogleGenerativeAI(api_key);

export async function POST(request) {
  try {
    // Parse the request body to get the user's question
    const { question } = await request.json();

    if (!question) {
      return NextResponse.json(
        { statusText: "error", message: "Question is required" },
        { status: 400 }
      );
    }

    // Initialize the generative model
    const modelName = "gemini-pro"; // Replace with the desired model name
    const model = genAI.getGenerativeModel({ model: modelName });

    // Generate a response from the AI
    const result = await model.generateContent(question);
    const response = await result.response;
    const answer = response.text();

    return NextResponse.json(
      {
        statusText: "success",
        question,
        answer,
        by: "Akarsh Rajput",
      },
      { status: 200 }
    );
  } catch (error) {
    if (
      error.name === "GoogleGenerativeAIResponseError" &&
      error.response.promptFeedback.safetyRatings.some(
        (rating) => rating.label === "LIKELY" || rating.label === "VERY_LIKELY"
      )
    ) {
      // Handle safety-related error
      console.error("Safety-related error:", error);
      return NextResponse.json(
        {
          statusText: "error",
          message: "Content blocked due to safety concerns",
        },
        { status: 403 }
      );
    } else {
      // Handle other errors
      console.error("Error generating response:", error);
      return NextResponse.json(
        {
          statusText: "error",
          message: "Internal server error",
          error: error.message,
        },
        { status: 500 }
      );
    }
  }
}
