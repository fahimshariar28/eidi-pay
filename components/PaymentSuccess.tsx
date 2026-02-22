"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function PaymentSuccess({
  amount,
  txId,
}: {
  amount: number;
  txId?: string;
}) {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md w-full border-t-8 border-green-500"
    >
      <div className="text-6xl mb-4 text-green-500">✅</div>
      <h2 className="text-2xl font-black italic uppercase">Salami Received!</h2>
      <p className="text-zinc-500 mt-2">৳{amount} added to wallet.</p>
      <p className="mt-6 text-sm font-mono text-zinc-400 bg-zinc-50 p-2 rounded">
        TxID: {txId}
      </p>
      <div className="mt-12 p-6 bg-[#E2136E]/5 border border-[#E2136E]/10 text-center">
        <p className="text-sm font-bold text-zinc-900 mb-4">
          Want to collect your own Salami? 🧧
        </p>
        <Link
          href="/"
          className="inline-block bg-[#E2136E] text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition"
        >
          Create Your Salami Link
        </Link>
      </div>
    </motion.div>
  );
}
