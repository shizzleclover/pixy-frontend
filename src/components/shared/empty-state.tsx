import { CameraIcon } from './icons';

/** Two blank prints and a camera: "nothing here yet", without stock photos in a guest's room. */
function BlankPrints() {
  return (
    <div className="relative mb-6 h-28 w-36" aria-hidden="true">
      <span className="absolute left-2 top-2 h-24 w-20 rotate-[-8deg] bg-card p-1.5 pb-5 shadow-print">
        <span className="block h-full w-full bg-placeholder" />
      </span>
      <span className="absolute right-2 top-0 h-24 w-20 rotate-[6deg] animate-float bg-card p-1.5 pb-5 shadow-print [--tilt:6deg]">
        <span className="flex h-full w-full items-center justify-center bg-rule text-muted">
          <CameraIcon className="h-7 w-7" />
        </span>
      </span>
    </div>
  );
}

export default function EmptyState({
  title,
  body,
  action,
  art = true,
}: {
  title: string;
  body?: string;
  action?: React.ReactNode;
  art?: boolean;
}) {
  return (
    <div className="flex animate-rise flex-col items-center px-6 py-14 text-center">
      {art && <BlankPrints />}
      <p className="font-serif text-[30px] leading-tight">{title}</p>
      {body && <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-muted">{body}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
