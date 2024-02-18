import { embedding } from 'litellm'
import type { RequestEvent } from './$types'
import { getXataClient } from '@/xata.server'

// Load the in-memory Xata client
const xata = getXataClient()

export async function POST({ request }: RequestEvent) {
  // Set of messages to create vector embeddings on
  const { messages = [] } = await request.json()
  // Call the OpenAI API to get emebeddings on the messages
  const generatedEmbeddings = await Promise.all(messages.map((input: string) => embedding({ input, model: 'text-embedding-3-small' })))
  // Insert all of them into Xata Embedding with the content
  await Promise.all(
    generatedEmbeddings.map((embeddingData, index) =>
      // Upsert the vector with description to be further as the context to upcoming questions
      xata.db.vectors.create({
        contents: messages[index],
        embedding: embeddingData.data[0].embedding,
      }),
    ),
  )
}
