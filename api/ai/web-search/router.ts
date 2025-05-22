import { streamText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const ALLOWED_ORIGIN =
  process.env.NODE_ENV === 'production'
    ? 'https://your-production-domain.com' // Replace with your actual production domain
    : '*';

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export async function POST(req: Request) {
  try {
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

    const response = result.toUIMessageStreamResponse();

    // Clone the response to modify headers
    const headers = new Headers(response.headers);
    headers.set('Access-Control-Allow-Origin', ALLOWED_ORIGIN);

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  } catch (error) {
    console.error('Error in web-search route:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while processing your request.' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        },
      }
    );
  }
}
