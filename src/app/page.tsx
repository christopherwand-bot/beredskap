import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

function formatDate(date: Date | null) {
  if (!date) {
    return "Ikke publisert";
  }

  return new Intl.DateTimeFormat("nb-NO", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

export default async function HomePage() {
  const articles = await db.article.findMany({
    where: {
      status: "PUBLISHED"
    },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }]
  });

  const [hero, ...rest] = articles;

  return (
    <main className="site-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <Link href="/" className="brandmark">
            BEREDSKAPS
            <span>AVISA</span>
          </Link>
          <nav className="section-nav">
            <span>Direkte</span>
            <span>Nyheter</span>
            <span>Trafikk</span>
            <span>Varsler</span>
            <span>Øvelse</span>
          </nav>
          <Link href="/admin/login" className="admin-link">
            Publiser
          </Link>
        </div>
      </header>

      <section className="ticker">
        <span className="ticker-label">Nå</span>
        <p>En treningsklar nettavis for øvelser, situasjonsmeldinger og raske oppdateringer.</p>
      </section>

      {hero ? (
        <section className="hero-grid">
          <article className="hero-card">
            <div className="meta-row">
              <span>{hero.category}</span>
              <span>{formatDate(hero.publishedAt)}</span>
            </div>
            <div className="hero-content">
              <div>
                {hero.kicker ? <p className="kicker">{hero.kicker}</p> : null}
                <h1>{hero.title}</h1>
                <p className="excerpt">{hero.excerpt}</p>
                <Link href={`/nyheter/${hero.slug}`} className="read-more">
                  Les saken
                </Link>
              </div>
              {hero.coverImage ? (
                <img src={hero.coverImage} alt={hero.title} className="hero-image" />
              ) : (
                <div className="hero-placeholder">Beredskap • Krise • Direkte</div>
              )}
            </div>
          </article>

          <aside className="side-stack">
            {rest.slice(0, 3).map((article) => (
              <Link
                href={`/nyheter/${article.slug}`}
                key={article.id}
                className="mini-card"
              >
                <p className="mini-category">{article.category}</p>
                <h2>{article.title}</h2>
                <p>{article.excerpt}</p>
              </Link>
            ))}
          </aside>
        </section>
      ) : (
        <section className="empty-state">
          <h1>Nettavisen er klar for første publisering</h1>
          <p>
            Logg inn i admin og opprett første sak. Når en artikkel publiseres, vises den
            automatisk her på forsiden.
          </p>
          <Link href="/admin/login" className="primary-button">
            Gå til publisering
          </Link>
        </section>
      )}

      <section className="news-grid">
        {rest.slice(hero ? 3 : 0).map((article) => (
          <Link href={`/nyheter/${article.slug}`} key={article.id} className="news-card">
            <div className="meta-row">
              <span>{article.category}</span>
              <span>{formatDate(article.publishedAt)}</span>
            </div>
            <h3>{article.title}</h3>
            <p>{article.excerpt}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
