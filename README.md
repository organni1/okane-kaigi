# おかね会議 Web MVP

子どもの「買っていい？」を、親子でお金を学ぶ時間に変えるWeb MVPです。

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth / PostgreSQL / RLS
- Vercel deployment

## Setup

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

`.env.local` にSupabaseの値を設定してください。

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3001
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` は現状のMVP画面では使用していません。将来の管理処理用に残していますが、クライアント側に露出しないでください。

## Supabase

Supabase SQL Editorで [supabase/schema.sql](supabase/schema.sql) を実行します。SQL Editorは100行以上のSQLも実行できます。構文エラーが出た場合は、貼り付け時に行が欠けていないか、途中の `create table` 文が切れていないかを確認してください。

作成されるテーブル:

- `parent_profiles`
- `child_profiles`
- `wallets`
- `wallet_transactions`
- `wish_items`
- `pre_purchase_checks`
- `consultations`
- `conversation_guides`

RLSは親ユーザーごとに `parent_user_id = auth.uid()` で分離します。

## Supabase Auth: メール確認ONの設定

本番寄りの運用では、Supabaseのメール確認をONにします。

1. Supabase Dashboard > Authentication > URL Configuration を開く
2. Site URLにローカルまたは本番URLを設定する
   - ローカル例: `http://localhost:3001`
   - 本番例: `https://your-vercel-domain.vercel.app`
3. Redirect URLsに以下を追加する
   - `http://localhost:3000/**`
   - `http://localhost:3001/**`
   - `http://127.0.0.1:3001/**`
   - `https://your-vercel-domain.vercel.app/**`
4. Authentication > Email Templates > Confirm signup を開く
5. 確認リンクをSSR向けに変更する

```html
<a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next={{ .RedirectTo }}">
  メールアドレスを確認する
</a>
```

signup後は `/signup/check-email?email=...` に遷移します。確認メールのリンクを開くと `/auth/confirm` でsession cookieが作成され、`/setup/child` へ進みます。

## 確認メールが届かない時のチェック

1. Authentication > Usersで対象メールのユーザーが作成されているか確認する
2. Logs > Auth Logsでsignup時刻付近のイベントを確認する
   - `user_signedup`
   - `user_confirmation_requested`
   - `user_repeated_signup`
   - rate limit / SMTP / mailer系エラー
3. Authentication > Emails / SMTP Settingsを確認する
4. Custom SMTP未設定の場合は、SupabaseのデフォルトSMTP制限に当たっていないか確認する
5. Gmail側で迷惑メール、プロモーション、すべてのメールを検索する
6. 同じメールで何度も試している場合は、少し待ってから再送する

再送は、`/signup/check-email?email=...` の固定表示されたメール宛に行います。再送画面でメールアドレスを直接入力させるUIはありません。`/login` から再送画面へ進む場合は、先にログイン画面のメール欄へ対象メールを入力してください。

本番運用ではResend、SendGrid、Postmark、AWS SESなどのCustom SMTP設定を推奨します。

## Assets

- Sample UI: `reference/sample-ui/`
- App images: `public/assets/images/`

元画像はDownloadsからコピーし、リポジトリ内で実装向けファイル名にリネーム済みです。

## Smoke Test

詳しい手順は [smoke-test.md](smoke-test.md) を参照してください。

大まかな流れ:

1. `/signup` で親アカウントを作成する
2. `/signup/check-email?email=...` で確認メール案内と再送導線を確認する
3. 確認メールを開き、`/setup/child` へ進む
4. 子どもプロフィール、任意のPIN、初期残高を作成する
5. Child Modeでほしいものを登録し、買う前チェックを送る
6. Parent Modeで相談にコメントと判断を返す
7. 子どもが相談結果を見る
8. walletの追加、減算、購入済み処理を確認する

## Vercel Deployment

Vercelにデプロイする場合は、Project Settings > Environment Variablesに以下を設定します。

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
SUPABASE_SERVICE_ROLE_KEY=
```

デプロイ後、SupabaseのSite URLとRedirect URLsにもVercel URLを追加してください。

## Legal Pages

`/terms` と `/privacy` はMVP向けの暫定文面です。正式リリース前に法務レビューを行ってください。

## Development

```bash
npm run lint
npm run build
```
