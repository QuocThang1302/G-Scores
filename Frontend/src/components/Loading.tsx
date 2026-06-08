type LoadingProps = {
  label?: string;
};

export default function Loading({ label = "Loading..." }: LoadingProps) {
  return (
    <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-teal-600" />
      <span>{label}</span>
    </div>
  );
}
