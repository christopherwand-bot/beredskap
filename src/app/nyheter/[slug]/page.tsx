import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { renderArticleBody } from "@/lib/articles";

export const dynamic = "force-dynamic";

type ArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await db.article.findUnique({
    where: { slug }
  });

  if (!article || article.status !== "PUBLISHED") {
    notFound();
  }

  const bodyHtml = await renderArticleBody(article.body);

  return (
    <main className="article-shell">
      <header className="topbar article-topbar">
        <div className="topbar-inner">
          <Link href="/" className="brandmark">
            BEREDSKAPS
            <span>AVISA</span>
          </Link>
          <Link href="/" className="admin-link">
            Til forsiden
          </Link>
        </div>
      </header>

      <article className="article-layout">
        <div className="article-meta">
          <span>{article.category}</span>
          <span>{article.author}</span>
          <span>
            {new Intl.DateTimeFormat("nb-NO", {
              dateStyle: "medium",
              timeStyle: "short"
            }).format(article.publishedAt ?? article.updatedAt)}
          </span>
        </div>
        {article.kicker ? <p className="kicker">{article.kicker}</p> : null}
        <h1>{article.title}</h1>
        <p className="article-excerpt">{article.excerpt}</p>
        {article.coverImage ? (
          <img src={article.coverImage} alt={article.title} className="article-image" />
        ) : null}
        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      </article>
    </main>
  );
}
