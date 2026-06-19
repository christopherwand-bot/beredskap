type ArticleFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
  article?: {
    id: string;
    title: string;
    kicker: string | null;
    category: string;
    excerpt: string;
    body: string;
    author: string;
    featured: boolean;
    status: "DRAFT" | "PUBLISHED";
    coverImage: string | null;
  };
};

export function ArticleForm({ action, submitLabel, article }: ArticleFormProps) {
  return (
    <form className="admin-card admin-form" action={action}>
      {article ? <input type="hidden" name="id" value={article.id} /> : null}

      <div className="form-grid">
        <div>
          <label htmlFor="title">Tittel</label>
          <input
            id="title"
            name="title"
            defaultValue={article?.title}
            placeholder="Hovedtittel på saken"
            required
          />
        </div>
        <div>
          <label htmlFor="kicker">Overtittel</label>
          <input
            id="kicker"
            name="kicker"
            defaultValue={article?.kicker ?? ""}
            placeholder="Kort forklaring over tittelen"
          />
        </div>
      </div>

      <div className="form-grid">
        <div>
          <label htmlFor="category">Kategori</label>
          <input
            id="category"
            name="category"
            defaultValue={article?.category ?? "Beredskap"}
            placeholder="Beredskap"
            required
          />
        </div>
        <div>
          <label htmlFor="author">Byline</label>
          <input
            id="author"
            name="author"
            defaultValue={article?.author ?? "Redaksjonen"}
            placeholder="Redaksjonen"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="excerpt">Ingress</label>
        <textarea
          id="excerpt"
          name="excerpt"
          defaultValue={article?.excerpt}
          rows={3}
          placeholder="Kort ingress som vises på forsiden og i toppen av artikkelen"
          required
        />
      </div>

      <div>
        <label htmlFor="body">Brødtekst (Markdown)</label>
        <textarea
          id="body"
          name="body"
          defaultValue={article?.body}
          rows={18}
          placeholder={`## Situasjonen nå\n\nSkriv hovedsaken her.\n\n- Punkt 1\n- Punkt 2`}
          required
        />
      </div>

      <div>
        <label htmlFor="coverImage">Hovedbilde</label>
        <input id="coverImage" name="coverImage" type="file" accept="image/*" />
        {article?.coverImage ? (
          <p className="form-hint">Eksisterende bilde: {article.coverImage}</p>
        ) : (
          <p className="form-hint">Valgfritt, men anbefalt for førstesaker.</p>
        )}
      </div>

      <div className="checkbox-row">
        <label>
          <input
            type="checkbox"
            name="featured"
            defaultChecked={article?.featured ?? false}
          />
          Vis som toppsak på forsiden
        </label>
        <label>
          <input
            type="checkbox"
            name="publishNow"
            defaultChecked={article?.status === "PUBLISHED"}
          />
          Publiser med en gang
        </label>
      </div>

      <button type="submit" className="primary-button">
        {submitLabel}
      </button>
    </form>
  );
}
