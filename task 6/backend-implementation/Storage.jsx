/**
 * storage.jsx
 * ─────────────────────────────────────────────────────────────
 * File upload/download helpers using Supabase Storage.
 * Place at: lib/storage.jsx
 *
 * Folder convention per bucket:
 *   {bucket}/{userId}/{filename}
 *
 * This means each user's files are isolated under their own
 * folder, which matches the RLS storage policies.
 */

import * as FileSystem from 'expo-file-system';
import { decode as atob } from 'base-64';
import { supabase } from './supabase';

// ── Upload any file from a local URI ──────────────────────────
/**
 * @param {string} bucket  - e.g. 'course-videos'
 * @param {string} userId  - current user's UUID
 * @param {string} fileUri - local file URI from ImagePicker / DocumentPicker
 * @param {string} fileName - desired file name (with extension)
 * @param {string} contentType - MIME type e.g. 'video/mp4'
 * @returns {Promise<{ path: string, publicUrl: string | null }>}
 */
export async function uploadFile(bucket, userId, fileUri, fileName, contentType) {
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

  // Get public URL (only works for public buckets like thumbnails, profile-images)
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);

  return { path: data.path, publicUrl: urlData?.publicUrl ?? null };
}

// ── Get signed URL for private buckets ───────────────────────
/**
 * @param {string} bucket
 * @param {string} path   - e.g. 'userId/filename.mp4'
 * @param {number} expiresIn - seconds (default 3600)
 */
export async function getSignedUrl(bucket, path, expiresIn = 3600) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);
  if (error) throw error;
  return data.signedUrl;
}

// ── Delete a file ─────────────────────────────────────────────
export async function deleteFile(bucket, path) {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;
}

// ── Convenience wrappers ──────────────────────────────────────

export const StorageService = {

  async uploadProfileImage(userId, fileUri) {
    const ext      = fileUri.split('.').pop();
    const fileName = `avatar_${Date.now()}.${ext}`;
    const result   = await uploadFile('profile-images', userId, fileUri, fileName, `image/${ext}`);
    // Update profile row with new avatar_url
    await supabase.from('profiles').update({ avatar_url: result.publicUrl }).eq('id', userId);
    return result;
  },

  async uploadThumbnail(userId, fileUri) {
    const ext      = fileUri.split('.').pop();
    const fileName = `thumb_${Date.now()}.${ext}`;
    return uploadFile('thumbnails', userId, fileUri, fileName, `image/${ext}`);
  },

  async uploadCourseVideo(userId, fileUri, originalName) {
    const fileName = `${Date.now()}_${originalName}`;
    return uploadFile('course-videos', userId, fileUri, fileName, 'video/mp4');
  },

  async uploadCourseAudio(userId, fileUri, originalName) {
    const fileName = `${Date.now()}_${originalName}`;
    return uploadFile('course-audio', userId, fileUri, fileName, 'audio/mpeg');
  },

  async uploadCourseNotes(userId, fileUri, originalName) {
    const fileName = `${Date.now()}_${originalName}`;
    return uploadFile('course-notes', userId, fileUri, fileName, 'application/pdf');
  },

  async uploadAssignment(userId, fileUri, originalName) {
    const fileName = `${Date.now()}_${originalName}`;
    return uploadFile('assignments', userId, fileUri, fileName, 'application/pdf');
  },

  /** Get a signed (time-limited) URL for a private file */
  getVideoUrl:  (userId, fileName, expiresIn = 3600) =>
    getSignedUrl('course-videos', `${userId}/${fileName}`, expiresIn),

  getAudioUrl:  (userId, fileName, expiresIn = 3600) =>
    getSignedUrl('course-audio', `${userId}/${fileName}`, expiresIn),

  getNotesUrl:  (userId, fileName, expiresIn = 3600) =>
    getSignedUrl('course-notes', `${userId}/${fileName}`, expiresIn),
};