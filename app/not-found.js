// app/not-found.tsx
'use client';

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-white text-black p-6">
      <h1 className="text-5xl font-bold mb-4">Page Not Found</h1>
      <p className="text-lg mb-6">Sorry, we couldn’t find that page.</p>
      <Link href="/" className="px-6 py-2 bg-purple-700 text-white rounded hover:bg-gray-800 transition">
        Go back home
      </Link>
    </div>
  );
}
