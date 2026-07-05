import { NextRequest, NextResponse } from "next/server";
import { updateProvider, deleteProvider } from "@/lib/firebase/providers";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json();
  await updateProvider(params.id, data);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await deleteProvider(params.id);
  return NextResponse.json({ ok: true });
}
