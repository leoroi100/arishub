# ArisHub

ArisHub e uma plataforma para operar `TikTok Ads` em escala com foco em:

- `Multi-BC`
- `OAuth 2.0`
- `vault` de tokens criptografados
- `pixel manager`
- `bulk launch` de campanhas, adgroups e ads
- `creative mask`, `cloaker proprio` e camada centralizada de operacao

## Stack

- `Next.js + TypeScript`
- `Supabase` para persistencia
- `tiktok-business-api-sdk-official` para os fluxos oficiais centrais
- client proprio para operacoes genericas da Marketing API

## Backend TikTok

Rotas entregues:

- `GET /api/tiktok/config`
- `GET /api/tiktok/oauth/start`
- `GET /api/tiktok/oauth/callback`
- `GET/POST /api/tiktok/connections`
- `GET /api/tiktok/advertisers`
- `GET /api/tiktok/business-centers`
- `GET/POST/PATCH /api/tiktok/pixels`
- `POST /api/tiktok/pixels/link`
- `POST /api/tiktok/assets/images`
- `POST /api/tiktok/assets/videos`
- `GET/POST /api/tiktok/campaigns`
- `GET/POST /api/tiktok/adgroups`
- `GET/POST /api/tiktok/ads`
- `GET /api/tiktok/reviews`
- `POST /api/tiktok/bulk-launch`
- `GET/POST /api/tiktok/operations`

## Banco

Execute `supabase/schema.sql` no seu projeto Supabase antes de usar as rotas.

## Variaveis de ambiente

Preencha `.env.example` com:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `TIKTOK_APP_ID`
- `TIKTOK_APP_SECRET`
- `TIKTOK_REDIRECT_URI`
- `TIKTOK_ENCRYPTION_KEY`
- `TIKTOK_AUTH_URL` opcional

## Desenvolvimento

```bash
npm install
npm run dev
```

## Validacao local

```bash
npm run lint
npm run build
```
