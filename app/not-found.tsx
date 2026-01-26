import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-8" dir="rtl">
      <h1 className="text-6xl font-bold mb-4 text-foreground">404</h1>
      <p className="text-xl text-muted-foreground mb-8">
        הדף שחיפשת לא נמצא
      </p>
      <Link
        href="/"
        className="text-primary hover:underline font-medium"
      >
        חזרה לדף הבית
      </Link>
    </div>
  );
}
