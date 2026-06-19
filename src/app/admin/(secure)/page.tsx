import Link from "next/link";
import { createArticleAction, deleteArticleAction, logoutAction, togglePublishAction } from "@/app/admin/actions";
import { ArticleForm } from "@/components/article-form";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const articles = await db.article.findMany({
    orderBy: [{ updatedAt: "desc" }]
  });

  return (
    <main className="admin-shell admin-shell-wide">
      <section className="admin-header">
        <div>
          <p className="eyebrow">Redaksjon</p>
          <h1>Publiseringsrom</h1>
          <p>Opprett nye saker, last opp bilde og send dem live med én avkryssing.</p>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="ghost-button">
            Logg ut
          </button>
        </form>
      </section>

      <section className="admin-columns">
        <div>
          <h2>Ny artikkel</h2>
          <ArticleForm action={createArticleAction} submitLabel="Opprett artikkel" />
        </div>

        <div>
          <h2>Eksisterende saker</h2>
          <div className="admin-list">
            {articles.length === 0 ? (
              <div className="admin-card">
                <p>Ingen saker ennå. Opprett den første til venstre.</p>
              </div>
            ) : (
              articles.map((article) => (
                <article key={article.id} className="admin-card admin-list-item">
                  <div>
                    <p className="list-status">
                      {article.status === "PUBLISHED" ? "Publisert" : "Utkast"} •{" "}
                      {article.category}
                    </p>
                    <h3>{article.title}</h3>
                    <p>{article.excerpt}</p>
                  </div>
                  <div className="row-actions">
                    <Link href={`/admin/artikler/${article.id}`} className="ghost-button">
                      Rediger
                    </Link>
                    <form action={togglePublishAction}>
                      <input type="hidden" name="id" value={article.id} />
                      <input type="hidden" name="status" value={article.status} />
                      <button type="submit" className="ghost-button">
                        {article.status === "PUBLISHED" ? "Ta ned" : "Publiser"}
                      </button>
                    </form>
                    <form action={deleteArticleAction}>
                      <input type="hidden" name="id" value={article.id} />
                      <button type="submit" className="danger-button">
                        Slett
                      </button>
                    </form>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
