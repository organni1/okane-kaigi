export function CheckProgress() {
  return (
    <div className="grid gap-3">
      <div className="mx-auto rounded-full bg-white px-8 py-3 text-2xl font-black shadow-sm">
        <span className="text-orange-500">1</span>/5
      </div>
      <div className="h-4 overflow-hidden rounded-full bg-white">
        <div className="h-full w-1/5 rounded-full bg-orange-500" />
      </div>
      <p className="text-center text-lg font-bold text-gray-600">買う前に、少し考えてみよう</p>
    </div>
  );
}
