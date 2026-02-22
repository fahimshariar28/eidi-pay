import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-zinc-200 py-10 mt-auto">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-zinc-500 text-sm">
          © 2026 Eidi Pay. All rights reserved.
        </p>
        <Link
          href="https://fahimshariar.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-zinc-900"
        >
          Developed by <span className="font-black">Fahim Shariar</span>
        </Link>
      </div>
    </footer>
  );
}
