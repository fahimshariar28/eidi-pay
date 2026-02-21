"use client";
import Link from "next/link";
import { useState } from "react";
import { Copy, Check, MessageCircle, Send } from "lucide-react"; // Standard icon set

interface Invoice {
  id: string;
  targetName: string;
  amount: number;
  status: string;
}

export default function DashboardTable({
  invoices,
  userName,
}: {
  invoices: Invoice[];
  userName: string;
}) {
  const [copyingId, setCopyingId] = useState<string | null>(null);

  // Use Env to keep logic SSR-friendly and linter-quiet
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const handleCopy = async (id: string) => {
    const url = `${baseUrl}/pay/${id}`;
    setCopyingId(id);
    await navigator.clipboard.writeText(url);
    setTimeout(() => setCopyingId(null), 2000);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-zinc-50 text-[10px] font-black uppercase text-zinc-400">
          <tr>
            <th className="px-8 py-4">Sponsor</th>
            <th className="px-8 py-4">Amount</th>
            <th className="px-8 py-4">Status</th>
            <th className="px-8 py-4 text-right">Quick Share</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {invoices.map((inv) => {
            const shareUrl = `${baseUrl}/pay/${inv.id}`;
            const shareText = `Assalamu Alaikum! Salami Invoice from ${userName}: ${shareUrl}`;

            // Messenger direct share URL (works best on mobile)
            const messengerUrl = `fb-messenger://share/?link=${encodeURIComponent(shareUrl)}`;
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

            return (
              <tr key={inv.id} className="group hover:bg-zinc-50 transition">
                <td className="px-8 py-6 font-bold text-zinc-900">
                  {inv.targetName}
                </td>
                <td className="px-8 py-6 font-black text-[#E2136E]">
                  ৳{inv.amount}
                </td>
                <td className="px-8 py-6">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      inv.status === "PAID"
                        ? "bg-green-100 text-green-600"
                        : "bg-orange-100 text-orange-600"
                    }`}
                  >
                    {inv.status}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex justify-end gap-2">
                    {/* WhatsApp Icon */}
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition shadow-sm"
                      title="Share on WhatsApp"
                    >
                      <MessageCircle size={18} />
                    </a>

                    {/* Messenger Icon */}
                    <a
                      href={messengerUrl}
                      className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition shadow-sm"
                      title="Share on Messenger"
                    >
                      <Send size={18} />
                    </a>

                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopy(inv.id)}
                      className={`p-2 bg-zinc-100 text-zinc-600 rounded-xl hover:bg-zinc-200 transition shadow-sm ${!copyingId ? "cursor-pointer" : "cursor-default"}`}
                    >
                      {copyingId === inv.id ? (
                        <Check size={18} className="text-green-600" />
                      ) : (
                        <Copy size={18} />
                      )}
                    </button>

                    <Link
                      href={`/pay/${inv.id}`}
                      className="ml-2 p-2 text-zinc-400 hover:text-black transition"
                    >
                      <span className="text-[10px] font-black uppercase">
                        View
                      </span>
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
