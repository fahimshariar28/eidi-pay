import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await prisma.invoice.update({
    where: { id },
    data: { status: "PAID" },
  });
  return NextResponse.json({ success: true });
}
