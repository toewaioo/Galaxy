
'use server';

import { supabase } from '@/lib/supabase';
import { generateMemories } from '@/ai/flows/generate-memories-flow';

// Helper to generate a simple unique ID.
const generateUniqueId = () => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Helper function to convert Data URI to Blob
const dataUriToBlob = (dataURI: string) => {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
};

async function uploadImages(imageUris: string[], galaxyId: string): Promise<string[]> {
    const uploadPromises = imageUris.map(async (uri, index) => {
        const blob = dataUriToBlob(uri);
        const fileExtension = blob.type.split('/')[1] || 'png';
        const uniqueFileName = `${generateUniqueId()}.${fileExtension}`;
        const filePath = `${galaxyId}/${uniqueFileName}`;

        const { error } = await supabase.storage
            .from('galaxies')
            .upload(filePath, blob, {
                contentType: blob.type,
                upsert: false,
            });

        if (error) {
            console.error('Error uploading image:', error);
            throw new Error(`Failed to upload image ${index + 1}`);
        }

        const { data } = supabase.storage.from('galaxies').getPublicUrl(filePath);
        return data.publicUrl;
    });
    
    return Promise.all(uploadPromises);
}

export async function createGalaxyWithPrompt(prompt: string): Promise<string> {
  const galaxyId = generateUniqueId();
  
  // 1. Generate images from prompt
  const memoryResult = await generateMemories({ prompt });
  if (!memoryResult || !memoryResult.imageUrls || memoryResult.imageUrls.length === 0) {
    throw new Error('Failed to generate memories from prompt.');
  }

  // 2. Upload generated images to Supabase storage
  const publicUrls = await uploadImages(memoryResult.imageUrls, galaxyId);

  // 3. Create a record in the 'galaxies' table
  const { error } = await supabase
    .from('galaxies')
    .insert([{ id: galaxyId, image_urls: publicUrls, prompt: prompt }]);

  if (error) {
    console.error('Error creating galaxy record:', error);
    throw new Error('Failed to save galaxy data.');
  }

  return galaxyId;
}

export async function createGalaxyWithImages(imageUris: string[]): Promise<string> {
    const galaxyId = generateUniqueId();
    
    // 1. Upload user-provided images
    const publicUrls = await uploadImages(imageUris, galaxyId);

    // 2. Create a record in the 'galaxies' table
    const { error } = await supabase
        .from('galaxies')
        .insert([{ id: galaxyId, image_urls: publicUrls }]);

    if (error) {
        console.error('Error creating galaxy record:', error);
        throw new Error('Failed to save galaxy data.');
    }
    
    return galaxyId;
}

export async function getGalaxyById(id: string): Promise<string[] | null> {
    const { data, error } = await supabase
        .from('galaxies')
        .select('image_urls')
        .eq('id', id)
        .single();
    
    if (error || !data) {
        console.error('Error fetching galaxy:', error);
        return null;
    }

    return data.image_urls as string[];
}
