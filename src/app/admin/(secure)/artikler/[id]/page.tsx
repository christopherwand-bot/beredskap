import Link from "next/link";
import { notFound } from "next/navigation";
import { updateArticleAction } from "@/app/admin/actions";
import { ArticleForm } from "@/components/article-form";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

type EditArticlePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;
  const article = await db.article.findUnique({ where: { id } });

  if (!article) {
    notFound();
  }

  return (
    <main className="admin-shell admin-shell-wide">
      <section className="admin-header">
        <div>
          <p className="eyebrow">Rediger sak</p>
          <h1>{article.title}</h1>
          <p>Oppdater innhold, bytt bilde eller gjør saken til toppsak.</p>
        </div>
        <Link href="/admin" className="ghost-button">
          Tilbake
        </Link>
      </section>

      <ArticleForm action={updateArticleAction} submitLabel="Lagre endringer" article={article} />
    </main>
  );
}
