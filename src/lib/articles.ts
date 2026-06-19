import fs from "node:fs/promises";
import path from "node:path";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { db } from "@/lib/db";
import { slugify } from "@/lib/slug";

const uploadsDir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || "./uploads");

export async function ensureUniqueSlug(title: string, currentId?: string) {
  const base = slugify(title) || "artikkel";
  let slug = base;
  let index = 1;

  while (true) {
    const existing = await db.article.findUnique({ where: { slug } });
    if (!existing || existing.id === currentId) {
      return slug;
    }

    index += 1;
    slug = `${base}-${index}`;
  }
}

export async function saveUpload(file: File | null | undefined) {
  if (!file || file.size === 0) {
    return null;
  }

  await fs.mkdir(uploadsDir, { recursive: true });

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeExtension = extension.replace(/[^a-z0-9]/g, "") || "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExtension}`;
  const filePath = path.join(uploadsDir, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());

  await fs.writeFile(filePath, buffer);

  return `/media/${fileName}`;
}

export async function renderArticleBody(markdown: string) {
  const html = await marked.parse(markdown, {
    breaks: true,
    gfm: true
  });

  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "img",
      "h1",
      "h2",
      "h3"
    ]),
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt"],
      "*": ["id"]
    }
  });
}
