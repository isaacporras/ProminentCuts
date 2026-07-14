import { serveUpload } from "@/lib/uploads";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  return serveUpload("gallery", filename);
}
