import Anthropic from "@anthropic-ai/sdk";

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("Missing ANTHROPIC_API_KEY environment variable");
}

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function analyzeDecision(description: string): Promise<string> {
  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Analyze this decision and provide a structured analysis with pros and cons:

Decision: ${description}

Please format the response with:
- Key Considerations (3-4 bullet points)
- Pros (3-4 bullet points)
- Cons (3-4 bullet points)
- Recommendation (brief paragraph)`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type === "text") {
    return content.text;
  }

  return "Unable to analyze decision";
}

export async function generateAutoIntro(
  contact: { name: string; role: string; opportunity: string }
): Promise<string> {
  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 256,
    messages: [
      {
        role: "user",
        content: `Generate a professional auto-intro message for this contact:

Name: ${contact.name}
Role: ${contact.role}
Opportunity: ${contact.opportunity}

Keep it concise and personalized (2-3 sentences).`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type === "text") {
    return content.text;
  }

  return "Unable to generate intro";
}

export async function estimateTaxSavings(income: number): Promise<string> {
  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: `For someone with an annual income of $${income.toLocaleString()}, provide:
- Estimated federal tax liability
- Tax savings opportunities (3 strategies)
- Action items to reduce tax burden

Be specific but note this is not tax advice.`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type === "text") {
    return content.text;
  }

  return "Unable to estimate tax savings";
}
