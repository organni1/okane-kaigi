import Link from "next/link";

type Section = {
  title: string;
  body: string[];
};

export function LegalPage({ title, lead, sections }: { title: string; lead: string; sections: Section[] }) {
  return (
    <main className="mx-auto min-h-dvh w-full max-w-[430px] bg-orange-50 px-5 py-8">
      <header className="mb-6">
        <Link href="/" className="text-3xl font-black text-orange-500">
          おかね会議
        </Link>
      </header>
      <article className="soft-card rounded-[2rem] p-6">
        <p className="text-sm font-bold text-orange-600">MVP暫定版</p>
        <h1 className="mt-2 text-3xl font-black">{title}</h1>
        <p className="mt-4 text-sm font-bold leading-7 text-gray-600">{lead}</p>
        <p className="mt-4 rounded-2xl bg-yellow-50 px-4 py-3 text-xs font-bold leading-6 text-yellow-800">
          この文面はMVP検証用の暫定文面であり、法務レビュー済みではありません。本番公開前に専門家による確認を行ってください。
        </p>
        <div className="mt-6 grid gap-6">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-black">{section.title}</h2>
              <div className="mt-2 grid gap-2 text-sm font-bold leading-7 text-gray-600">
                {section.body.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Link href="/signup" className="rounded-2xl bg-orange-500 px-4 py-3 text-center font-black text-white">
          登録へ戻る
        </Link>
        <Link href="/" className="rounded-2xl border border-orange-300 bg-white px-4 py-3 text-center font-black text-orange-600">
          トップへ
        </Link>
      </div>
    </main>
  );
}
