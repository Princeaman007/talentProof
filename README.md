# TalentProof

This repository contains the TalentProof full-stack application (backend + frontend).

## Overview
- Backend: Node.js (Express), Mongoose (MongoDB), JWT auth with rotating refresh tokens, CSRF protection, rate limiting, Helmet, logging, and Swagger docs.
- Frontend: React (Vite) with axios configured to use HttpOnly cookies for auth.

## Quick start (development)
1. Copy env file:

```powershell
cd backend
copy .env.example .env
# Edit .env to provide real values
```

2. Install dependencies and run backend + frontend in separate terminals:

```powershell
# Backend
cd backend
npm install
npm run dev

# Frontend
cd client
npm install
npm run dev
```

3. For development you can set `SKIP_EMAILS=true` in `backend/.env` to avoid sending real emails.

## Important env variables (backend)
- `MONGODB_URI` — MongoDB connection string.
- `JWT_SECRET` — Secret used to sign JWTs. Change in production.
- `REFRESH_TOKEN_EXPIRE_MS` — Refresh token lifetime in milliseconds (default 7 days).
- `DEPRECATE_TOKEN_IN_BODY` — Set to `true` to stop returning access tokens in API responses (prefer cookies).
- `EMAIL_TEST_MODE` — `ethereal` (default in test), or `noop` (fast, no network). In CI we recommend `noop`.
- `EMAIL_ALLOW_INVALID_CERT` — `true` only for debugging self-signed certs (discouraged in prod).
- `CLIENT_URL` — Frontend URL used to build links in emails.
- CSRF: Server exposes `/api/csrf-token` and expects the token in `X-CSRF-Token` header for mutating requests.

See `backend/.env.example` for more settings and comments.

## Testing
- Backend tests use Jest + `mongodb-memory-server` for fast, ephemeral DB tests.
- ESM tests require Node's experimental VM modules flag. Run tests with:

```powershell
$env:NODE_OPTIONS='--experimental-vm-modules'
cd backend
npm ci
npm test
```

- In CI we set `EMAIL_TEST_MODE=noop` to avoid network calls and speed up tests.

## CI (GitHub Actions)
- A workflow is provided at `.github/workflows/ci.yml`. It:
  - Uses Node 18.
  - Installs backend deps and runs Jest with `NODE_OPTIONS=--experimental-vm-modules` and `EMAIL_TEST_MODE=noop`.
  - Placeholder frontend job included.

## Security notes / recommended production settings
- Use HTTPS in production and ensure `CLIENT_URL` is set to your production domain.
- Ensure `JWT_SECRET` is strong and stored in your secret manager.
- Set `EMAIL_ALLOW_INVALID_CERT=false` (default) and configure valid TLS certs for SMTP.
- Use `ALLOWED_ORIGINS` to restrict CORS to your frontend domains.
- Consider using Redis for refresh-token blacklisting and job queues for email sending at scale.
  - The repo includes a `docker-compose.yml` with a `redis` service for local testing.
  - To enable Redis-backed rate limiting, set `REDIS_URL` in `backend/.env` (e.g. `redis://localhost:6379`).

## Running the email queue locally

If you want to offload email sending to a background worker using Redis/BullMQ, the project includes a simple queue and worker:

- `backend/queues/emailQueue.js` — helper to enqueue email jobs.
- `backend/queues/worker.js` — a worker that processes `send-email` jobs and sends mail.

Steps to run the queue locally:

1. Start Redis (the repository includes a `redis` service in `docker-compose.yml`):

```powershell
cd C:\Users\princ\talentproof
docker compose up -d redis
```

2. Configure `backend/.env` with `REDIS_URL=redis://localhost:6379` and ensure `EMAIL_QUEUE=true` (the default `.env.example` enables this).

3. Start the backend server (the worker is imported by the server and will start automatically when `REDIS_URL` is set):

```powershell
cd backend
npm install
npm run dev
```

4. The worker logs appear in the backend process output. Jobs are enqueued when the email util detects Redis and `EMAIL_QUEUE` is enabled. You can still fall back to immediate sending by setting `EMAIL_QUEUE=false`.

Optional: inspect or purge jobs using `bullmq`'s APIs or by adding a small management script (I can add that if you'd like).

## Next steps
- Remove token-in-body by setting `DEPRECATE_TOKEN_IN_BODY=true` after the frontend uses cookies exclusively.
- Add monitoring/alerts and backups for your MongoDB instance.

If you want, I can add a short section that shows how to deploy this to a small production stack (Docker + managed MongoDB + secrets).

## Dependabot & gestion des dépendances

Dependabot est activé pour le dépôt (configurée pour scanner `backend` et `client` chaque semaine).
- Les PRs créées par Dependabot seront étiquetées `dependencies`.
- Utilise le template `/.github/PULL_REQUEST_TEMPLATE/dependency-audit.md` pour documenter les changements et les implications (tests, audit, étapes de rollback).
- Processus recommandé pour les PRs de dépendances:
  1. Lancer la CI et vérifier que tous les tests passent.
  2. Vérifier le résultat de l'étape `npm audit` (CI échoue si vulnérabilités `high|critical`).
  3. Pour les mises à jour mineures/patch, merger rapidement si CI est vert.
  4. Pour les mises à jour majeures, tester localement (exécuter la suite de tests, vérifier breaking changes) avant de merger.

Si tu veux, je peux activer l'automerge pour les mises à jour de patch/minor après approbation CI.