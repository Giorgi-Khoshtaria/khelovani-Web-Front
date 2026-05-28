import { cookies } from "next/headers";
import { Lang } from "@/lib/types/lang.types";
import "./loading.scss";

const LOADING_TEXT: Record<Lang, string> = {
  ge: "იტვირთება…",
  en: "Loading…",
};

export default async function MainLoading() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value as Lang) || "ge";

  return (
    <div className="route-loading" role="status" aria-live="polite">
      <span className="route-loading__spinner" aria-hidden />
      <span className="route-loading__text">
        {LOADING_TEXT[lang] ?? LOADING_TEXT.ge}
      </span>
    </div>
  );
}
