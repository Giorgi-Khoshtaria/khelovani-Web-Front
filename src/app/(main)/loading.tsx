import "./loading.scss";

export default function MainLoading() {
  return (
    <div className="route-loading" role="status" aria-live="polite">
      <span className="route-loading__spinner" aria-hidden />
      <span className="route-loading__text">Loading…</span>
    </div>
  );
}
