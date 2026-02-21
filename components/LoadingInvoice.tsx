export default function LoadingInvoice() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-[#E2136E]/20 rounded-full animate-ping" />
        <div className="relative flex items-center justify-center w-20 h-20 bg-white border-4 border-[#E2136E] rounded-full shadow-xl">
          <span className="text-3xl animate-bounce">🧧</span>
        </div>
      </div>

      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-black italic tracking-tighter uppercase animate-pulse">
          Fetching Salami...
        </h2>
        <p className="text-zinc-400 text-sm font-medium">
          Checking the bank for your Eidi. Please wait.
        </p>
      </div>

      <div className="w-full max-w-md p-6 bg-zinc-50 rounded-4xl border border-zinc-200 animate-pulse">
        <div className="h-4 bg-zinc-200 rounded w-1/3 mb-4" />
        <div className="h-10 bg-zinc-200 rounded w-full mb-2" />
        <div className="h-10 bg-zinc-200 rounded w-2/3" />
      </div>
    </div>
  );
}
