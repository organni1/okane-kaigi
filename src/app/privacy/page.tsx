import { LegalPage } from "@/components/common/LegalPage";

const sections = [
  {
    title: "1. 取得する情報",
    body: ["親アカウントのメールアドレス、子どものニックネーム、年齢グループ、仮想残高、ほしいもの、買う前チェック、相談内容を取得します。"],
  },
  {
    title: "2. 取得しない子ども情報",
    body: ["子どもの本名、住所、学校名、生年月日、電話番号、実際の銀行口座情報は収集しません。"],
  },
  {
    title: "3. 利用目的",
    body: ["親子のお金に関する相談、仮想残高管理、買う前チェック、サービス改善のために利用します。"],
  },
  {
    title: "4. 外部サービスの利用",
    body: ["認証とデータ保存にSupabaseを利用します。将来、ホスティングやメール送信などにVercelやメール配信サービスを利用する場合があります。"],
  },
  {
    title: "5. データ保護",
    body: ["ユーザーごとのデータはRow Level Securityにより分離し、他の親ユーザーから見えないようにします。Service Role Keyはクライアント側に露出しません。"],
  },
  {
    title: "6. 問い合わせ",
    body: ["個人情報に関する問い合わせ先は、本番公開時に運営者の連絡先を記載します。"],
  },
  {
    title: "7. 改定",
    body: ["本ポリシーは、機能追加や法令対応に応じて更新されることがあります。"],
  },
];

export default function PrivacyPage() {
  return <LegalPage title="プライバシーポリシー" lead="おかね会議で扱う情報と、その使い方について説明します。" sections={sections} />;
}
