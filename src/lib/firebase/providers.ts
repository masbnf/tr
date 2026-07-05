import { adminDb } from "./admin";
import { Provider, CreateProviderInput } from "@/types/provider";

const COL = "providers";

export async function getAllProviders(): Promise<Provider[]> {
  const snap = await adminDb.collection(COL).orderBy("name").get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Provider));
}

export async function getActiveProviders(): Promise<Provider[]> {
  const snap = await adminDb.collection(COL).where("isActive", "==", true).get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Provider));
}

export async function createProvider(data: CreateProviderInput): Promise<string> {
  const ref = adminDb.collection(COL).doc();
  await ref.set({ ...data, createdAt: new Date() });
  return ref.id;
}

export async function updateProvider(id: string, data: Partial<Provider>): Promise<void> {
  await adminDb.collection(COL).doc(id).update(data);
}

export async function deleteProvider(id: string): Promise<void> {
  await adminDb.collection(COL).doc(id).delete();
}
