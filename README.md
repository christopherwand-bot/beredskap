# Beredskapsavisa

En enkel nettavis for krise- og beredskapsøvelser, bygget for rask publisering av tekst og bilde. Løsningen har:

- forside med tydelig tabloid uttrykk inspirert av norske nettaviser
- passordbeskyttet adminflate
- opplasting av hovedbilde
- utkast og publisering
- SQLite-database som fungerer lokalt og på Railway

## Stack

- Next.js 15
- Prisma
- SQLite
- GitHub for kildekode og historikk
- Railway for drift

## Kom i gang lokalt

1. Installer avhengigheter:

```bash
pnpm install
```

2. Opprett miljøfil:

```bash
cp .env.example .env
```

3. Sett egne verdier i `.env`:

```env
DATABASE_URL="file:./dev.db"
ADMIN_PASSWORD="velg-et-sterkt-passord"
ADMIN_SESSION_SECRET="velg-en-lang-hemmelig-streng"
SITE_URL="http://localhost:3000"
UPLOAD_DIR="./uploads"
```

4. Opprett databasen:

```bash
pnpm run db:push
```

5. Start lokalt:

```bash
pnpm run dev
```

6. Legg inn en demosak hvis dere vil ha en ferdig forside med en gang:

```bash
pnpm run db:seed
```

## Publiseringsflyt

- Gå til `/admin/login`
- Logg inn med `ADMIN_PASSWORD`
- Opprett sak med tittel, ingress, brødtekst og bilde
- Kryss av `Publiser med en gang` for å sende saken live
- Kryss av `Vis som toppsak på forsiden` for å løfte saken øverst

## Railway-oppsett

For å gjøre publisering enkelt over tid anbefales denne flyten:

1. Opprett et GitHub-repo og push denne mappen.
2. Opprett et nytt prosjekt i Railway fra repoet.
3. Legg til en persistent volume i Railway og monter den på `/data`.
4. Sett disse miljøvariablene i Railway:

```env
DATABASE_URL="file:/data/prod.db"
ADMIN_PASSWORD="et-sterkt-produksjonspassord"
ADMIN_SESSION_SECRET="en-lang-hemmelig-produksjonsstreng"
SITE_URL="https://deres-domene.no"
UPLOAD_DIR="/data/uploads"
```

5. Kjør denne kommandoen én gang i Railway shell eller som predeploy-jobb:

```bash
pnpm exec prisma db push
```

6. Deploy.

## Railway-notat

Repoet er satt opp for Railway med [nixpacks.toml](/Users/christopherawand/Documents/Codex/2026-06-19-jeg-skal-lage-en-nettavis-der/nixpacks.toml), som tvinger Node 20 og en kompatibel `pnpm`-versjon under build.
Ved oppstart i Railway kjøres `prisma db push` automatisk før appen starter, så dere trenger ikke kjøre databasekommandoer manuelt i Railway-konsollen.

## Anbefalt drift

- Bruk GitHub som kilde for all kode og endringer.
- Bruk Railway volume for database og opplastede bilder.
- Hold én produksjonsinstans for øvelsen.
- Bytt `ADMIN_PASSWORD` mellom øvelser.

## Media og lagring

Løsningen lagrer opplastede bilder i mappen som er definert av `UPLOAD_DIR` og serverer dem via `/media/...`.

- Lokalt kan dere bruke `./uploads`
- I Railway bør dere bruke en persistent volume, for eksempel `/data/uploads`

Hvis dere senere vil gjøre løsningen enda mer robust, er neste steg å bytte denne delen til S3 eller Cloudflare R2.
