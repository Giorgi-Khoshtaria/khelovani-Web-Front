export enum ProductCondition {
  HANDMADE        = "handmade",
  MADE_TO_ORDER   = "made_to_order",
  LIMITED_EDITION = "limited_edition",
  ONE_OF_A_KIND   = "one_of_a_kind",
  RESTORED        = "restored",
  UPCYCLED        = "upcycled",
}

export const PRODUCT_CONDITIONS = Object.values(ProductCondition) as ProductCondition[];

export const CONDITION_LABELS: Record<ProductCondition, { ge: string; en: string }> = {
  [ProductCondition.HANDMADE]:        { ge: "ხელნაკეთი",            en: "Handmade" },
  [ProductCondition.MADE_TO_ORDER]:   { ge: "შეკვეთით",              en: "Made to Order" },
  [ProductCondition.LIMITED_EDITION]: { ge: "შეზღუდული გამოშვება",  en: "Limited Edition" },
  [ProductCondition.ONE_OF_A_KIND]:   { ge: "ერთ-ერთი ეგზემპლარი", en: "One of a Kind" },
  [ProductCondition.RESTORED]:        { ge: "აღდგენილი",             en: "Restored" },
  [ProductCondition.UPCYCLED]:        { ge: "გადამუშავებული",        en: "Upcycled" },
};
