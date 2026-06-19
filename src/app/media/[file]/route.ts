import fs from "node:fs/promises";
import path from "node:path";
import { NextRequest } from "next/server";

const uploadsDir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || "./uploads");

const contentTypes: Record<string, string> = {
  avif: "image/avif",
  gif: "image/gif",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp"
};

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ file: string }> }
) {
  const { file } = await context.params;
  const safeFile = path.basename(file);
  const absolutePath = path.join(uploadsDir, safeFile);

  try {
    const buffer = await fs.readFile(absolutePath);
    const extension = safeFile.split(".").pop()?.toLowerCase() || "jpg";

    return new Response(buffer, {
      headers: {
        "Content-Type": contentTypes[extension] || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
