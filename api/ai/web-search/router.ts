
import { streamText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const result = await streamText({
    model: openai('gpt-4o'),
    prompt,
    tools: {
      web_search_preview: tool({
        description: 'Perform a web search and return a preview of the results.',
        parameters: z.object({
          query: z.string().describe('The search query.'),
        }),
        execute: async ({ query }) => {
          // Implement your web search logic here
          return `Search results for "${query}"`;
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
