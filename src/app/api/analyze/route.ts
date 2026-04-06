import { NextResponse } from "next/server";
import client from "@/lib/anthropic";
import {
  COMPLIANCE_SYSTEM_PROMPT,
  buildAnalysisPrompt,
  ANALYSIS_RESULT_SCHEMA,
} from "@/lib/prompts";

export async function POST(request: Request) {
  try {
    const { guidelines, paper } = await request.json();

    if (!guidelines || !paper) {
      return NextResponse.json(
        { error: "Both guidelines and paper text are required" },
        { status: 400 }
      );
    }

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 16000,
      system: COMPLIANCE_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: buildAnalysisPrompt(guidelines, paper),
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json(
        { error: "No text response from AI" },
        { status: 500 }
      );
    }

    // Extract JSON from the response - handle both raw JSON and markdown-wrapped JSON
    let jsonText = textBlock.text;
    const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1].trim();
    }

    const result = JSON.parse(jsonText);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Analysis failed" },
      { status: 500 }
    );
  }
}
