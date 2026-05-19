# Smoke Test Checklist

Supabase実データでMVPの主要フローを最後まで確認するためのチェックリストです。Stripe、課金、PWA、通知、AIチャットは今回の対象外です。

## 事前準備

- [ ] `npm install` が完了している
- [ ] `.env.local` にSupabaseの認証情報を設定している
- [ ] `NEXT_PUBLIC_SITE_URL=http://localhost:3001` を設定している
- [ ] Supabase SQL Editorで `supabase/schema.sql` を実行済み
- [ ] Supabase Authのメール確認がONになっている
- [ ] SupabaseのSite URLが `http://localhost:3001` になっている
- [ ] Redirect URLsに `http://localhost:3001/**` と `http://127.0.0.1:3001/**` を追加している
- [ ] Confirm signupメールテンプレートが `/auth/confirm` を通るリンクになっている

## 認証

- [ ] `/signup` で親アカウントを作成できる
- [ ] パスワードが弱い場合、入力ルールが分かるエラーになる
- [ ] checkbox未チェックでは登録できない
- [ ] signup後に `/signup/check-email` へ進む
- [ ] `/signup/check-email` で確認メールを再送できる
- [ ] `/login` から確認メール再送導線へ進める
- [ ] 確認メールリンクから `/setup/child` へ進む
- [ ] 親がlogin/logoutできる
- [ ] 未ログイン時に保護ページへ入れない

## 初回設定

- [ ] 子どもプロフィールを作成できる
- [ ] PINは4桁の数字だけ受け付ける
- [ ] walletが自動作成される
- [ ] 初期残高がwalletに反映される
- [ ] `/parent/dashboard` に子どもカードと今あるお金が表示される

## Child Mode

- [ ] `/child/select` で子どもプロフィールを選べる
- [ ] 子どもがPINでChild Modeに入れる
- [ ] PIN前にChild Mode URLを直打ちするとPIN画面へ戻る
- [ ] `/child/[childId]/home` で今あるお金が表示される
- [ ] walletが見つからない場合も画面が破綻しない

## ほしいものと買う前チェック

- [ ] 子どもがほしいものを登録できる
- [ ] 登録後に買う前チェックへ進む
- [ ] 買う前チェックに回答できる
- [ ] 買う前チェック送信後、相談が1件作成される
- [ ] 同じほしいもので相談が重複作成されない
- [ ] wish itemが存在しないURLでは一覧へ戻る

## Parent Mode

- [ ] `/parent/consultations` に相談が表示される
- [ ] 相談一覧フィルターが効く
- [ ] `/parent/consultations/[id]` で相談詳細を確認できる
- [ ] consultationが存在しないURLでは相談一覧へ戻る
- [ ] 買う前チェック回答、今あるお金、買った後の金額が表示される
- [ ] 声かけヒントが表示される
- [ ] 親がコメントと判断を保存できる
- [ ] 保存後、子ども結果画面に判断とコメントが反映される

## Wallet

- [ ] `/parent/wallet` で現在残高が表示される
- [ ] 親がwallet残高を追加できる
- [ ] 親がwallet残高を減算できる
- [ ] 残高不足の減算は分かりやすいエラーになる
- [ ] 取引履歴が表示される
- [ ] OK後に購入済みにするとwallet残高が減る
- [ ] 購入済み処理後、wish itemの状態が「買ったもの」になる

## データ安全性

- [ ] 別親ユーザーのデータがRLSで見えない
- [ ] 子どもの本名、学校名、住所、生年月日を入力させていない
- [ ] `SUPABASE_SERVICE_ROLE_KEY` がクライアントコードに露出していない

## UI確認

- [ ] 360px幅で主要フローが操作できる
- [ ] 390px幅で主要フローが操作できる
- [ ] 430px幅で主要フローが操作できる
- [ ] Empty Stateが自然な日本語で表示される
- [ ] エラー表示が操作可能な内容になっている

## コマンド確認

- [ ] `npm run lint`
- [ ] `npm run build`
