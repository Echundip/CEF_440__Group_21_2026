/**
 * storage.ts
 * ─────────────────────────────────────────────────────────────
 * File upload/download helpers using Supabase Storage.
 * Place at: src/lib/storage.ts
 *
 * Folder convention per bucket:
 *   {bucket}/{userId}/{filename}
 *
 * This means each user's files are isolated under their own
 * folder, which matches the RLS storage policies.
 */

import { decode as atob } from 'base-64';
import * as FileSystem from 'expo-file-system';
import { supabase } from './supabase';

// ============================================================
// TYPES
// ============================================================

export interface UploadResult {
  path: string;
  publicUrl: string | null;
}

type ImageExtension = 'jpg' | 'jpeg' | 'png' | 'webp' | 'gif';

// ============================================================
// CORE HELPERS
// ============================================================

/**
 * Upload any file from a local URI to a Supabase Storage bucket.
 *
 * @param bucket      - e.g. 'course-videos'
 * @param userId      - current user's UUID
 * @param fileUri     - local file URI from ImagePicker / DocumentPicker
 * @param fileName    - desired file name (with extension)
 * @param contentType - MIME type e.g. 'video/mp4'
 * @returns           - storage path and public URL (null for private buckets)
 */
export async function uploadFile(
  bucket: string,
  userId: string,
  fileUri: string,
  fileName: string,
  contentType: string,
): Promise<UploadResult> {
  // Read file as base64
  const base64 = await FileSystem.readAsStringAsync(fileUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // Convert base64 to ArrayBuffer
  const binaryStr = atob(base64);
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }

  const path = `${userId}/${fileName}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, bytes.buffer, {
      contentType,
      upsert: true,
    });

  if (error) throw error;

  // Public URL only works for public buckets (thumbnails, profile-images)
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);

  return { path: data.path, publicUrl: urlData?.publicUrl ?? null };
}

/**
 * Get a signed (time-limited) URL for a file in a private bucket.
 *
 * @param bucket    - Storage bucket name
 * @param path      - e.g. 'userId/filename.mp4'
 * @param expiresIn - seconds until expiry (default 3600)
 */
export async function getSignedUrl(
  bucket: string,
  path: string,
  expiresIn = 3600,
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);
  if (error) throw error;
  return data.signedUrl;
}

/**
 * Delete a file from a Storage bucket.
 *
 * @param bucket - Storage bucket name
 * @param path   - File path within the bucket
 */
export async function deleteFile(bucket: string, path: string): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;
}

// ============================================================
// CONVENIENCE WRAPPERS
// ============================================================

export const StorageService = {

  async uploadProfileImage(userId: string, fileUri: string): Promise<UploadResult> {
    const ext      = fileUri.split('.').pop() as ImageExtension;
    const fileName = `avatar_${Date.now()}.${ext}`;
    const result   = await uploadFile('profile-images', userId, fileUri, fileName, `image/${ext}`);
    // Update profile row with new avatar_url
    await supabase.from('profiles').update({ avatar_url: result.publicUrl }).eq('id', userId);
    return result;
  },

  async uploadThumbnail(userId: string, fileUri: string): Promise<UploadResult> {
    const ext      = fileUri.split('.').pop() as ImageExtension;
    const fileName = `thumb_${Date.now()}.${ext}`;
    return uploadFile('thumbnails', userId, fileUri, fileName, `image/${ext}`);
  },

  async uploadCourseVideo(userId: string, fileUri: string, originalName: string): Promise<UploadResult> {
    const fileName = `${Date.now()}_${originalName}`;
    return uploadFile('course-videos', userId, fileUri, fileName, 'video/mp4');
  },

  async uploadCourseAudio(userId: string, fileUri: string, originalName: string): Promise<UploadResult> {
    const fileName = `${Date.now()}_${originalName}`;
    return uploadFile('course-audio', userId, fileUri, fileName, 'audio/mpeg');
  },

  async uploadCourseNotes(userId: string, fileUri: string, originalName: string): Promise<UploadResult> {
    const fileName = `${Date.now()}_${originalName}`;
    return uploadFile('course-notes', userId, fileUri, fileName, 'application/pdf');
  },

  async uploadAssignment(userId: string, fileUri: string, originalName: string): Promise<UploadResult> {
    const fileName = `${Date.now()}_${originalName}`;
    return uploadFile('assignments', userId, fileUri, fileName, 'application/pdf');
  },

  /** Get a signed (time-limited) URL for a private video file */
  getVideoUrl: (userId: string, fileName: string, expiresIn = 3600): Promise<string> =>
    getSignedUrl('course-videos', `${userId}/${fileName}`, expiresIn),

  /** Get a signed (time-limited) URL for a private audio file */
  getAudioUrl: (userId: string, fileName: string, expiresIn = 3600): Promise<string> =>
    getSignedUrl('course-audio', `${userId}/${fileName}`, expiresIn),

  /** Get a signed (time-limited) URL for a private notes file */
  getNotesUrl: (userId: string, fileName: string, expiresIn = 3600): Promise<string> =>
    getSignedUrl('course-notes', `${userId}/${fileName}`, expiresIn),
};