import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

// Vision-based feedback for Guided Practice. Server-side only.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = "claude-opus-4-8";

interface FeedbackRequest {
  imageBase64: string;
  mediaType: string;
  courseName: string;
  cue: string;
  safety: string[];
}

const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ configured: false });

  let body: FeedbackRequest;
  try {
    body = (await req.json()) as FeedbackRequest;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (!body?.imageBase64 || !ALLOWED.has(body.mediaType)) {
    return NextResponse.json({ error: "A valid image is required." }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });
  const system = [
    `You are a supportive AI tutor on SkillBloom reviewing a learner's practice photo for the course "${body.courseName}".`,
    `The learner was asked to: ${body.cue}`,
    body.safety.length ? `Relevant safety notes:\n${body.safety.map((s) => `- ${s}`).join("\n")}` : ``,
    `Give kind, specific, encouraging feedback based only on what you can see in the image.`,
    `Never make medical or health claims. Fold in relevant safety/hygiene/technique reminders. Keep each field to one or two short sentences.`,
    `If the image is unclear or off-topic, say so gently in "well" and ask for a clearer photo in "next".`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 500,
      system,
      messages: [
        {
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: body.mediaType as "image/png", data: body.imageBase64 } },
            { type: "text", text: "Review my work and give feedback." },
          ],
        },
      ],
      output_config: {
        format: {
          type: "json_schema",
          schema: {
            type: "object",
            properties: {
              well: { type: "string", description: "What was done well" },
              improve: { type: "string", description: "What to improve" },
              safety: { type: "string", description: "Safety or technique reminder" },
              next: { type: "string", description: "Suggested next step" },
            },
            required: ["well", "improve", "safety", "next"],
            additionalProperties: false,
          },
        },
      },
    });

    if (response.stop_reason === "refusal") {
      return NextResponse.json({ error: "unavailable" }, { status: 422 });
    }

    const text = response.content.find((b): b is Anthropic.TextBlock => b.type === "text")?.text ?? "";
    const parsed = JSON.parse(text);
    return NextResponse.json({ feedback: parsed });
  } catch {
    return NextResponse.json({ error: "The AI reviewer is unavailable right now." }, { status: 502 });
  }
}
