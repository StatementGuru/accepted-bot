export async function POST(req) {
  const { systemPrompt, messages } = await req.json();

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      system: systemPrompt + "\n\nIMPORTANT: Keep your responses SHORT — 1-3 sentences typically, like a real teenager texting. Occasionally give a longer answer when the topic excites you. You are a real student, not an AI. Never break character.",
      messages: messages,
    }),
  });

  const data = await response.json();
  const content = data.content?.[0]?.text || "idk";

  return new Response(JSON.stringify({ content }), {
    headers: { "Content-Type": "application/json" },
  });
}
