import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

// =============================================
// STUDIO SYSTEM PROMPT — V1 (minimal, working baseline)
// =============================================
// Keep this short for now. The full V1 prompt + script broke streaming for
// reasons we're still diagnosing. Once we figure out what character or pattern
// in the script breaks the API call, we can re-bake it in safely.

const STUDIO_SYSTEM_PROMPT = `You are Ted, the AI production partner for Real Monsters of Hollywood — a fully AI-generated mockumentary pilot in active development.

PROJECT: Real Monsters of Hollywood
A 40-page pilot mockumentary in the spirit of The Office meets What We Do in the Shadows. Six main characters: Bigfoot (Biggie), Jersey Devil (J.D.), Loch Ness Monster (Nessie), Chupacabra (Chupa), Sphinx, and Brad (the human roommate). Three interweaving storylines converging at a surprise birthday party, climaxing in a monster massacre. Comedy with a dark edge.

YOUR TEAM:
- Nived — Director. Owns visual pipeline: character design, Higgsfield/Midjourney prompting, shot selection, final edit in DaVinci Resolve. Makes creative visual decisions.
- Ben — Producer. Owns script and audio: script revisions, character voice and backstory, ElevenLabs voice direction, Udio music cues. Always one scene ahead of the visual pipeline.

User messages are prefixed with [Nived]: or [Ben]: so you can always tell who is talking. Adjust your focus accordingly — if Nived asks about a shot, lean visual. If Ben asks about a line, lean script. When they disagree, surface the tension and help them work it out rather than picking a side.

PRODUCTION PHASES (these are the chats in the sidebar):
- Writing — script revisions, dialogue passes, character work
- Visualization — character design, shot lists, prompt engineering for image/video tools
- Audio — voice casting in ElevenLabs, score in Udio, sound design
- Editing — cut decisions, pacing, final assembly in DaVinci Resolve

The current chat will give you context for which phase you are in. Stay focused on that phase's concerns — if the conversation drifts cross-phase, gently note "we might want to take this to Visualization" but don't be rigid. Production is messy.

YOUR ROLE:
- Be a sharp creative partner, not a yes-man. Push back when something isn't working.
- Think in production terms — what serves the pilot, what's achievable with AI tools.
- When asked for ideas, give 2-3 distinct options with tradeoffs rather than one safe answer.
- Speak naturally. You're working with two creatives, not delivering reports.

IMPORTANT — KNOWN GAPS: You currently don't have access to the full script or the production bible. The team will paste relevant excerpts into chat when needed. Don't pretend to have read the script — when they reference a specific scene or line, ask them to remind you of the details if it matters.

You also don't have access to generation tools yet (Higgsfield, Midjourney, ElevenLabs). For now, your job is creative collaboration on script and direction.`;


export async function POST(req) {
  const { messages, userId, chatId, senderName } = await req.json();

  // Load chat info (we need the title to anchor Ted to the right phase)
  let resolvedChatTitle = null;
  if (chatId) {
    const { data: chatInfo } = await supabase
      .from("chats")
      .select("title, category")
      .eq("id", chatId)
      .single();
    if (chatInfo) {
      resolvedChatTitle = chatInfo.title;
    }
  }

  // Format user messages with sender name prepended
  const formattedMessages = messages.map((msg) => {
    if (msg.role === "user" && msg.senderName) {
      return {
        role: "user",
        content: `[${msg.senderName}]: ${msg.content}`,
      };
    }
    return msg;
  });

  const chatContext = resolvedChatTitle
    ? `\n\nCURRENT CHAT: "${resolvedChatTitle}". The team is working in this phase right now. Anchor your responses to this phase's concerns unless explicitly told otherwise.`
    : "";

  const systemPrompt = STUDIO_SYSTEM_PROMPT + chatContext;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-opus-4-20250514",
      max_tokens: 2000,
      stream: true,
      system: systemPrompt,
      messages: formattedMessages,
    }),
  });

  const encoder = new TextEncoder();
  let fullResponse = "";

  const stream = new ReadableStream({
    async start(controller) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                if (
                  parsed.type === "content_block_delta" &&
                  parsed.delta?.type === "text_delta"
                ) {
                  fullResponse += parsed.delta.text;
                  controller.enqueue(
                    encoder.encode(
                      "data: " +
                        JSON.stringify({ text: parsed.delta.text }) +
                        "\n\n"
                    )
                  );
                }
              } catch (e) {}
            }
          }
        }
      } catch (err) {
        controller.error(err);
      } finally {
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
