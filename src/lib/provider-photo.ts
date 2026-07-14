import { uploadDir, uploadUrlPrefix, deleteUpload } from "./uploads";

export const PROVIDER_PHOTO_URL_PREFIX = uploadUrlPrefix("providers");
export const PROVIDER_PHOTO_DIR = uploadDir("providers");

export async function deleteProviderPhoto(photoUrl: string | null | undefined) {
  return deleteUpload("providers", photoUrl);
}
