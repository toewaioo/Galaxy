
'use server';
/**
 * @fileOverview A flow to generate a series of romantic, space-themed images based on a user's memory prompt.
 *
 * - generateMemories - A function that takes a prompt and returns image URLs.
 * - GenerateMemoriesInput - The input type for the generateMemories function.
 * - GenerateMemoriesOutput - The return type for the generateMemories function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateMemoriesInputSchema = z.object({
  prompt: z.string().describe('A user-provided memory or feeling to be turned into images.'),
});
export type GenerateMemoriesInput = z.infer<typeof GenerateMemoriesInputSchema>;

const GenerateMemoriesOutputSchema = z.object({
  imageUrls: z.array(z.string()).describe('An array of URLs for the generated images.'),
});
export type GenerateMemoriesOutput = z.infer<typeof GenerateMemoriesOutputSchema>;

// This is an exported wrapper function that can be called from server components.
export async function generateMemories(input: GenerateMemoriesInput): Promise<GenerateMemoriesOutput> {
  return generateMemoriesFlow(input);
}

const generateMemoriesFlow = ai.defineFlow(
  {
    name: 'generateMemoriesFlow',
    inputSchema: GenerateMemoriesInputSchema,
    outputSchema: GenerateMemoriesOutputSchema,
  },
  async (input) => {
    // We will generate 5 images in parallel
    const imagePromises = Array(5).fill(0).map(() => 
      ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: `A romantic, dream-like, ethereal, artistic interpretation of the following memory, suitable for a comet in a personal galaxy: "${input.prompt}". Use a soft, glowing, magical aesthetic with hints of cosmic dust and nebula colors.`,
        config: {
          responseModalities: ['IMAGE', 'TEXT'],
        },
      })
    );

    const results = await Promise.all(imagePromises);
    
    const imageUrls = results.map(result => {
        if (result.media && result.media.url) {
            return result.media.url;
        }
        // Fallback placeholder if an image fails to generate
        return 'https://placehold.co/100x100.png';
    });

    return { imageUrls };
  }
);
