import { adminDb } from "./admin";
import { ServiceRequest, CreateRequestInput } from "@/types/request";
import { OrderStatus } from "@/types/enums";

const COL = "requests";

export async function createRequest(data: CreateRequestInput): Promise<string> {
  const ref = adminDb.collection(COL).doc();
  await ref.set({
    ...data,
    status:    OrderStatus.PENDING,
    createdAt: new Date(),
  });
  return ref.id;
}

export async function getRequest(id: string): Promise<ServiceRequest | null> {
  const snap = await adminDb.collection(COL).doc(id).get();
  if (!snap.exists) return null;
  return { id: snap.id, ...snap.data() } as ServiceRequest;
}

export async function getAllRequests(): Promise<ServiceRequest[]> {
  const snap = await adminDb.collection(COL).orderBy("createdAt", "desc").get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ServiceRequest));
}

export async function updateRequestStatus(
  id: string,
  status: OrderStatus,
  assignedProvider?: string
): Promise<void> {
  const data: Record<string, unknown> = { status, updatedAt: new Date() };
  if (assignedProvider) data.assignedProvider = assignedProvider;
  await adminDb.collection(COL).doc(id).update(data);
}
