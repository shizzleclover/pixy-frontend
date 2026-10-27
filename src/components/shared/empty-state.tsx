export default function EmptyState({
  icon = '📷',
  title,
  body,
  action,
}: {
  icon?: string;
  title: string;
  body?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-14 text-center">
      <span className="icon-tile h-14 w-14 text-2xl">{icon}</span>
      <p className="mt-4 font-display text-lg font-semibold text-white">{title}</p>
      {body && <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-slate-400">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
