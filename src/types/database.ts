export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type RowBase = {
  id: string;
  created_at: string;
  updated_at?: string;
};

export type ParentProfile = RowBase & {
  user_id: string;
  display_name: string | null;
  onboarding_completed: boolean;
};

export type ChildProfile = RowBase & {
  parent_user_id: string;
  nickname: string;
  age_group: "age_6_8" | "age_9_12" | "other";
  avatar_id: string | null;
  pin_hash: string | null;
  currency_label: "円" | "ポイント";
  is_active: boolean;
};

export type Wallet = RowBase & {
  child_profile_id: string;
  parent_user_id: string;
  balance: number;
};

export type WalletTransaction = {
  id: string;
  parent_user_id: string;
  child_profile_id: string;
  wallet_id: string;
  transaction_type: "income" | "spending" | "adjustment" | "refund";
  amount: number;
  category: string | null;
  memo: string | null;
  related_wish_item_id: string | null;
  created_by_role: "parent" | "child" | "system";
  created_at: string;
};

export type WishItem = RowBase & {
  parent_user_id: string;
  child_profile_id: string;
  title: string;
  price: number;
  category: string;
  reason: string | null;
  found_place: string | null;
  priority: number | null;
  desire_level: number | null;
  image_url: string | null;
  status: string;
  approved_at: string | null;
  purchased_at: string | null;
  archived_at: string | null;
};

export type PrePurchaseCheck = RowBase & {
  parent_user_id: string;
  child_profile_id: string;
  wish_item_id: string;
  need_or_want: string | null;
  reason_text: string | null;
  already_have_similar: boolean | null;
  wait_choice: string | null;
  expected_usage: string | null;
  child_payment_ratio: number | null;
  remaining_balance_after_purchase: number | null;
  answer_json: Json | null;
  completed_at: string | null;
};

export type Consultation = RowBase & {
  parent_user_id: string;
  child_profile_id: string;
  wish_item_id: string;
  status: "open" | "closed";
  parent_decision: string | null;
  parent_comment: string | null;
  child_response: string | null;
  decided_at: string | null;
};

export type ConversationGuide = RowBase & {
  trigger_type: string;
  category: string | null;
  age_group: string;
  title: string;
  ng_example: string | null;
  recommended_example: string;
  question_examples: Json | null;
  is_premium: boolean;
  sort_order: number;
  is_active: boolean;
};

export type Database = {
  public: {
    Tables: {
      parent_profiles: { Row: ParentProfile; Insert: Partial<ParentProfile>; Update: Partial<ParentProfile> };
      child_profiles: { Row: ChildProfile; Insert: Partial<ChildProfile>; Update: Partial<ChildProfile> };
      wallets: { Row: Wallet; Insert: Partial<Wallet>; Update: Partial<Wallet> };
      wallet_transactions: { Row: WalletTransaction; Insert: Partial<WalletTransaction>; Update: Partial<WalletTransaction> };
      wish_items: { Row: WishItem; Insert: Partial<WishItem>; Update: Partial<WishItem> };
      pre_purchase_checks: { Row: PrePurchaseCheck; Insert: Partial<PrePurchaseCheck>; Update: Partial<PrePurchaseCheck> };
      consultations: { Row: Consultation; Insert: Partial<Consultation>; Update: Partial<Consultation> };
      conversation_guides: { Row: ConversationGuide; Insert: Partial<ConversationGuide>; Update: Partial<ConversationGuide> };
    };
  };
};
