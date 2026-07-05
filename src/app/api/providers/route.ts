import { NextRequest, NextResponse } from "next/server";
import { createProviderSchema } from "@/lib/validators";
import { getAllProviders, createProvider } from "@/lib/firebase/providers";

export async function GET() {
  const providers = await getAllProviders();
  return NextResponse.json(providers);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = createProviderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }
  const id = await createProvider(parsed.data);
  return NextResponse.json({ id }, { status: 201 });
}
