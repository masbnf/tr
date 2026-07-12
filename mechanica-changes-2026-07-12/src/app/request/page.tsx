import { Suspense } from "react";
import RequestForm from "@/components/forms/RequestForm";

export default function RequestPage() {
  return (
    <main className="max-w-md mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-2xl font-bold mb-6">ثبت درخواست</h1>
      <Suspense fallback={null}>
        <RequestForm />
      </Suspense>
    </main>
  );
}
