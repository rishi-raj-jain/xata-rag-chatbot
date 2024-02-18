import Replicate from 'replicate'
import { embedding } from 'litellm'
import type { RequestEvent } from './$types'
import { getXataClient } from '@/xata.server'
import { ReplicateStream, StreamingTextResponse } from 'ai'
import { experimental_buildLlama2Prompt } from 'ai/prompts'

// Load the in-memory Xata client
const xata = getXataClient()

// Instantiate the Replicate API
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export async function POST({ request }: RequestEvent) {
  // Set of messages between user and chatbot
  const { messages } = await request.json()
  // Get the latest question stored in the last message of the chat array
  const userMessages = messages.filter((i: any) => i.role === 'user')
  const input = userMessages[userMessages.length - 1].content
  // Generate embeddings of the latest question using OpenAI
  const embeddingData = await embedding({ input, model: 'text-embedding-3-small' })
  // Fetch the relevant set of records based on the embedding
  const relevantRecords = await xata.db.vectors.vectorSearch('embedding', embeddingData.data[0].embedding, { size: 5 })
  // Combine all the metadata of the relevant vectors
  const systemContext = relevantRecords.records.map((i) => i.contents).join('\n')
  // Now use Replicate LLAMA 70B streaming to perform the autocompletion with context
  const response = await replicate.predictions.create({
    // You must enable streaming.
    stream: true,
    // The model must support streaming. See https://replicate.com/docs/streaming
    model: 'meta/llama-2-70b-chat',
    // Format the message list into the format expected by Llama 2
    // @see https://github.com/vercel/ai/blob/99cf16edf0a09405d15d3867f997c96a8da869c6/packages/core/prompts/huggingface.ts#L53C1-L78C2
    input: {
      prompt: experimental_buildLlama2Prompt([
        {
          // create a system content message to be added as
          // the llama2prompt generator will supply it as the context with the API
          role: 'system',
          content: systemContext.substring(0, Math.min(systemContext.length, 2000)),
        },
        {
          // create a system instruction
          // make sure to wrap code blocks with ``` so that the svelte markdown picks it up correctly
          role: 'assistant',
          content: `When creating repsonses sure to wrap any code blocks that you output as code blocks and not text so that they can be rendered beautifully.`,
        },
        // also, pass the whole conversation!
        ...messages,
      ]),
    },
  })
  // Convert the response into a friendly text-stream
  const stream = await ReplicateStream(response)
  // Respond with the stream
  return new StreamingTextResponse(stream)
}
