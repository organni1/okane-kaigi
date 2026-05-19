# おかね会議 Web MVP

子どもの「買っていい？」を、親子でお金を学ぶ時間に変えるWeb MVPです。

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth / PostgreSQL / RLS
- Vercel想定

## Setup

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

`.env.local`にSupabaseの値を設定してください。

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY`はMVPの通常画面では使用していません。クライアント側に露出しないでください。

## Supabase

Supabase SQL Editorで`supabase/schema.sql`を実行します。

作成されるテーブル:

- `parent_profiles`
- `child_profiles`
- `wallets`
- `wallet_transactions`
- `wish_items`
- `pre_purchase_checks`
- `consultations`
- `conversation_guides`

RLSは親ユーザーごとに`parent_user_id = auth.uid()`で分離します。

## Assets

- Sample UI: `reference/sample-ui/`
- App images: `public/assets/images/`

元画像はDownloadsからコピーし、リポジトリ内で実装向けファイル名にリネーム済みです。

## Smoke Test

1. `/signup`で親アカウントを作成する
2. `/setup/child`で子どもプロフィール、PIN、初期残高を作成する
3. `/parent/dashboard`で子どもカードと残高が表示される
4. 子ども画面を開き、PINで`/child/[childId]/home`に入る
5. ほしいものを登録する
6. 買う前チェックを送信し、相談結果画面で「親に相談中だよ」を確認する
7. `/parent/consultations/[id]`で相談を確認し、コメントと判断を保存する
8. 子どもの結果画面で親コメントと判断を見る
9. `/parent/wallet`で残高を調整し、取引履歴を確認する

## Development

```bash
npm run lint
npm run build
```
