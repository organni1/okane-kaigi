export const CATEGORIES = [
  { value: "toy", label: "おもちゃ", image: "/assets/images/star-character.png" },
  { value: "game", label: "ゲーム", image: "/assets/images/game-controller.png" },
  { value: "book", label: "本", emoji: "本" },
  { value: "stationery", label: "文房具", emoji: "鉛筆" },
  { value: "snack", label: "おかし", emoji: "おかし" },
  { value: "clothes", label: "洋服", emoji: "服" },
  { value: "gacha", label: "ガチャ", image: "/assets/images/gacha-machine.png" },
  { value: "game_charge", label: "ゲーム課金", image: "/assets/images/game-controller.png" },
  { value: "gift", label: "プレゼント", emoji: "ギフト" },
  { value: "event", label: "お祭り/イベント", emoji: "イベント" },
  { value: "other", label: "その他", emoji: "その他" },
] as const;

export const categoryLabel = (value?: string | null) =>
  CATEGORIES.find((category) => category.value === value)?.label ?? "その他";

export const categoryImage = (value?: string | null) =>
  (() => {
    const category = CATEGORIES.find((item) => item.value === value);
    return category && "image" in category ? category.image : "/assets/images/star-character.png";
  })();
