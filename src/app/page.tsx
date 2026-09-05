import Chat from "@/components/chat/Chat";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-sm font-bold text-white">
              N
            </div>
            <div>
              <h1 className="text-sm font-semibold leading-none text-zinc-100 sm:text-base">
                Test Chatbot <span className="font-normal text-zinc-400">/ Nexuss Ads Test</span>
              </h1>
              <p className="mt-1 flex items-center gap-2 text-xs text-zinc-400">
                <span className="inline-flex items-center rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-amber-300 border border-amber-500/20">
                  Testing environment
                </span>
                <span className="hidden sm:inline">Groq-powered · No ads yet</span>
              </p>
            </div>
          </div>
          <a
            href="https://groq.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-xs text-zinc-500 hover:text-zinc-300 sm:block"
          >
            Powered by Groq
          </a>
        </div>
      </header>

      {/* Chat area */}
      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="flex flex-1 flex-col mx-auto w-full max-w-5xl">
          <Chat />
        </div>
      </main>

      <footer className="border-t border-zinc-800 bg-zinc-950 px-4 py-3 text-center text-xs text-zinc-600">
        Isolated test project · Not connected to Nexuss main app · Adsterra Native Banner will be added after deployment
      </footer>
    </div>
  );
}
