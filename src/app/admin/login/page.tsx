import { AdminLoginForm } from "@/components/admin-login-form";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <main className="admin-shell">
      <section className="admin-hero">
        <p className="eyebrow">Beredskapsavisa</p>
        <h1>Logg inn og publiser øvingssaker raskt</h1>
        <p>
          Løsningen er laget for én jobb: få tekst og bilde raskt ut på en forside som
          føles kjent og tydelig i en beredskapsøvelse.
        </p>
      </section>
      <AdminLoginForm />
    </main>
  );
}
