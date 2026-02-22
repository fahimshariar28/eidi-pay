import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import DashboardTable from "@/components/DashboardTable";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.isAnonymous) {
    redirect("/login");
  }

  const invoices = await prisma.invoice.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const totalSalami = invoices
    .filter((inv) => inv.status === "PAID")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const activeLinksCount = invoices.filter(
    (inv) => inv.status == "unpaid",
  ).length;

  const pendingSalamiCount = invoices
    .filter((inv) => inv.status == "unpaid")
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 min-h-[85vh]">
      {/* Welcome Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-black tracking-tight">
          Welcome,{" "}
          <span className="text-[#E2136E]">
            {session.user.name.split(" ")[0]}
          </span>
          ! 🧧
        </h1>
        <p className="text-zinc-500 text-sm mt-1">
          Manage your sponsors and track your Eid earnings.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            💰
          </div>
          <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-1">
            Total Collected
          </p>
          <h2 className="text-4xl font-black text-green-500">৳{totalSalami}</h2>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-200 shadow-sm">
          <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-1">
            Active Links
          </p>
          <h2 className="text-4xl font-black text-black">{activeLinksCount}</h2>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-200 shadow-sm">
          <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-1">
            Pending Salami
          </p>
          <h2 className="text-4xl font-black text-red-500">
            ৳{pendingSalamiCount}
          </h2>
        </div>
      </div>

      {/* Invoice List */}
      <div className="bg-white rounded-[3rem] border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-zinc-100 flex justify-between items-center">
          <h3 className="text-xl font-black italic uppercase tracking-tighter">
            Recent History
          </h3>
          <Link
            href="/"
            className="bg-[#E2136E] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#c00f5c] transition cursor-pointer"
          >
            + Create New
          </Link>
        </div>

        {invoices.length === 0 ? (
          <div className="p-20 text-center">
            <p className="text-zinc-400 font-medium">
              No invoices yet. Send a link to get started!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <DashboardTable invoices={invoices} userName={session.user.name} />
          </div>
        )}
      </div>
    </main>
  );
}
