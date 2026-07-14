export default function PublicLoading() {
  return (
    <div className="page-shell py-14" role="status" aria-label="Memuat halaman">
      <div className="clay-card animate-pulse p-8 sm:p-12">
        <div className="h-5 w-32 rounded-full bg-sky-100" />
        <div className="mt-6 h-12 max-w-xl rounded-2xl bg-slate-100" />
        <div className="mt-4 h-5 max-w-2xl rounded-xl bg-slate-100" />
        <div className="mt-3 h-5 max-w-lg rounded-xl bg-slate-100" />
        <div className="mt-9 h-72 rounded-[2rem] bg-sky-50" />
      </div>
      <span className="sr-only">Sedang memuat halaman.</span>
    </div>
  );
}
