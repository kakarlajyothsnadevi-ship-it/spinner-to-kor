import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { buildSystemPrompt, type TutorRequestBody, type TutorTurn } from "@/lib/tutor-api";

// Server-side only. The API key never reaches the browser.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = "claude-opus-4-8";
const MAX_TURNS = 12; // cap history sent to the model

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  // No key configured → tell the client to fall back to the offline tutor.
  if (!apiKey) {
    return NextResponse.json({ configured: false });
  }

  let body: TutorRequestBody;
  try {
    body = (await req.json()) as TutorRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body?.context || !Array.isArray(body.messages) || body.messages.length === 0) {
    return NextResponse.json({ error: "Missing messages or context." }, { status: 400 });
  }

  // Keep only the recent turns, and ensure the sequence starts with a user turn.
  const trimmed: TutorTurn[] = body.messages
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-MAX_TURNS);
  while (trimmed.length && trimmed[0].role !== "user") trimmed.shift();
  if (trimmed.length === 0) {
    return NextResponse.json({ error: "No learner message to respond to." }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  try {
    // Short conversational replies — non-streaming keeps well under HTTP timeouts.
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 400,
      system: buildSystemPrompt(body.context),
      messages: trimmed.map((m) => ({ role: m.role, content: m.content })),
    });

    if (response.stop_reason === "refusal") {
      return NextResponse.json({
        reply:
          "I'd rather not go there, but I'm happy to keep helping with this lesson. What would you like to try next?",
        model: response.model,
      });
    }

    const reply = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();

    return NextResponse.json({
      reply: reply || "Let's keep going — could you say a little more about what you'd like help with?",
      model: response.model,
    });
  } catch (err) {
    // Rate limits, network, etc. — client falls back to the offline tutor.
    const status = err instanceof Anthropic.APIError ? err.status ?? 502 : 502;
    return NextResponse.json(
      { error: "The AI tutor is unavailable right now." },
      { status: status >= 400 && status < 600 ? status : 502 },
    );
  }
}
