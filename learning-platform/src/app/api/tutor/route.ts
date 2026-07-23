import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { buildSystemPrompt, type TutorRequestBody, type TutorTurn } from "@/lib/tutor-api";

// Server-side only. The API key never reaches the browser.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = "claude-opus-4-8";
const MAX_TURNS = 12; // cap history sent to the model
const REFUSAL_REPLY =
  "I'd rather not go there, but I'm happy to keep helping with this lesson. What would you like to try next?";

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
  const encoder = new TextEncoder();

  // Stream text deltas straight to the browser so the tutor starts "speaking"
  // immediately instead of waiting for the whole reply. Short replies keep this
  // well under any timeout.
  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const stream = client.messages.stream({
          model: MODEL,
          max_tokens: 300,
          system: buildSystemPrompt(body.context),
          messages: trimmed.map((m) => ({ role: m.role, content: m.content })),
        });

        let sentAny = false;
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            sentAny = true;
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }

        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal" && !sentAny) {
          controller.enqueue(encoder.encode(REFUSAL_REPLY));
        }
        controller.close();
      } catch {
        // Rate limit / network / auth — surface an error so the client can
        // fall back to the offline tutor.
        controller.error(new Error("tutor_unavailable"));
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Tutor-Mode": "live",
      "Cache-Control": "no-store",
    },
  });
}
