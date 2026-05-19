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

`.env.local`にSupabaseの値を設定してください。

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3001
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY`は現状のMVP画面では使用していません。将来の管理処理用に残していますが、クライアント側に露出しないでください。

## Supabase

Supabase SQL Editorで`supabase/schema.sql`を実行します。SQL Editorは100行以上のSQLも実行できます。構文エラーが出た場合は、貼り付け時に行が欠けていないか確認してください。

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

## Supabase Auth: メール確認ONの設定

本番寄りの運用では、Supabaseのメール確認をONにします。

1. Supabase Dashboard > Authentication > URL Configuration
2. Site URLにローカルまたは本番URLを設定
   - ローカル例: `http://localhost:3001`
   - 本番例: `https://your-vercel-domain.vercel.app`
3. Redirect URLsに以下を追加
   - `http://localhost:3000/**`
   - `http://localhost:3001/**`
   - `http://127.0.0.1:3001/**`
   - `https://your-vercel-domain.vercel.app/**`
4. Authentication > Email Templates > Confirm signupを開く
5. 確認リンクをSSR向けに変更

```html
<a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next={{ .RedirectTo }}">
  メールアドレスを確認する
</a>
```

signup後は`/signup/check-email`に遷移します。確認メールのリンクを開くと`/auth/confirm`でsession cookieが作成され、`/setup/child`へ進みます。

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
6. 同じメールで何度も試している場合は、少し待ってから`/signup/check-email`で再送する

本番運用ではResend、SendGrid、Postmark、AWS SESなどのCustom SMTP設定を推奨します。

## Assets

- Sample UI: `reference/sample-ui/`
- App images: `public/assets/images/`

元画像はDownloadsからコピーし、リポジトリ内で実装向けファイル名にリネーム済みです。

## Smoke Test

1. `/signup`で親アカウントを作成する
2. `/signup/check-email`で確認メール案内と再送導線を確認する
3. 確認メールを開き、`/setup/child`へ進む
4. `/setup/child`で子どもプロフィール、PIN、初期残高を作成する
5. `/parent/dashboard`で子どもカードと残高が表示される
6. 子ども画面を開き、PINで`/child/[childId]/home`に入る
7. ほしいものを登録する
8. 買う前チェックを送信し、相談結果画面で「親に相談中だよ」を確認する
9. `/parent/consultations/[id]`で相談を確認し、コメントと判断を保存する
10. 子どもの結果画面で親コメントと判断を見る
11. `/parent/wallet`で残高を調整し、取引履歴を確認する
12. OK後に親相談詳細から購入済みにして、残高が減ることを確認する

## Vercel Deployment

Vercelにデプロイする場合は、Project Settings > Environment Variablesに以下を設定します。

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
SUPABASE_SERVICE_ROLE_KEY=
```

デプロイ後、SupabaseのSite URLとRedirect URLsにもVercel URLを追加してください。

## Development

```bash
npm run lint
npm run build
```
