"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ensureUniqueSlug, saveUpload } from "@/lib/articles";
import { isAuthenticated, login, logout } from "@/lib/auth";

type LoginState = {
  error: string;
};

export async function loginAction(_: LoginState, formData: FormData): Promise<LoginState> {
  const password = String(formData.get("password") || "");
  const ok = await login(password);

  if (!ok) {
    return {
      error: "Feil passord. Prøv igjen."
    };
  }

  redirect("/admin");
}

function getChecked(formData: FormData, field: string) {
  return formData.get(field) === "on";
}

async function requireAuth() {
  const ok = await isAuthenticated();
  if (!ok) {
    redirect("/admin/login");
  }
}

export async function createArticleAction(formData: FormData) {
  await requireAuth();

  const title = String(formData.get("title") || "").trim();
  const excerpt = String(formData.get("excerpt") || "").trim();
  const body = String(formData.get("body") || "").trim();

  if (!title || !excerpt || !body) {
    redirect("/admin");
  }

  const imagePath = await saveUpload(formData.get("coverImage") as File | null);
  const featured = getChecked(formData, "featured");
  const publishNow = getChecked(formData, "publishNow");
  const slug = await ensureUniqueSlug(title);

  const article = await db.article.create({
    data: {
      title,
      slug,
      kicker: String(formData.get("kicker") || "").trim() || null,
      category: String(formData.get("category") || "Beredskap").trim(),
      excerpt,
      body,
      coverImage: imagePath,
      author: String(formData.get("author") || "Redaksjonen").trim(),
      featured,
      status: publishNow ? "PUBLISHED" : "DRAFT",
      publishedAt: publishNow ? new Date() : null
    }
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/nyheter/${article.slug}`);
  redirect(`/admin/artikler/${article.id}`);
}

export async function updateArticleAction(formData: FormData) {
  await requireAuth();

  const id = String(formData.get("id") || "");
  const existing = await db.article.findUnique({ where: { id } });

  if (!existing) {
    redirect("/admin");
  }

  const title = String(formData.get("title") || "").trim();
  const excerpt = String(formData.get("excerpt") || "").trim();
  const body = String(formData.get("body") || "").trim();
  const imagePath = await saveUpload(formData.get("coverImage") as File | null);
  const featured = getChecked(formData, "featured");
  const publishNow = getChecked(formData, "publishNow");
  const slug = await ensureUniqueSlug(title, existing.id);

  const updated = await db.article.update({
    where: { id },
    data: {
      title,
      slug,
      kicker: String(formData.get("kicker") || "").trim() || null,
      category: String(formData.get("category") || "Beredskap").trim(),
      excerpt,
      body,
      coverImage: imagePath || existing.coverImage,
      author: String(formData.get("author") || "Redaksjonen").trim(),
      featured,
      status: publishNow ? "PUBLISHED" : "DRAFT",
      publishedAt: publishNow ? existing.publishedAt ?? new Date() : null
    }
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/nyheter/${existing.slug}`);
  revalidatePath(`/nyheter/${updated.slug}`);
  redirect(`/admin/artikler/${updated.id}`);
}

export async function togglePublishAction(formData: FormData) {
  await requireAuth();

  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "DRAFT") === "PUBLISHED";

  const article = await db.article.update({
    where: { id },
    data: {
      status: status ? "DRAFT" : "PUBLISHED",
      publishedAt: status ? null : new Date()
    }
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/nyheter/${article.slug}`);
}

export async function deleteArticleAction(formData: FormData) {
  await requireAuth();

  const id = String(formData.get("id") || "");
  const article = await db.article.findUnique({ where: { id } });

  if (article) {
    await db.article.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath(`/nyheter/${article.slug}`);
  }
}

export async function logoutAction() {
  await logout();
  redirect("/admin/login");
}
