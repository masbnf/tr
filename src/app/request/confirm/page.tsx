export default function ConfirmPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="text-5xl mb-4">✅</div>
      <h1 className="text-2xl font-bold mb-2">درخواست ثبت شد</h1>
      <p className="text-gray-500 text-center mb-4">
        کارشناسان ما در حال بررسی درخواست شما هستند.
      </p>
      <p className="text-sm text-gray-400">
        وضعیت: <span className="text-yellow-600 font-semibold">در حال بررسی</span>
      </p>
      <a href="tel:+98" className="mt-8 text-blue-600 underline text-sm">
        تماس با پشتیبانی
      </a>
    </main>
  );
}
