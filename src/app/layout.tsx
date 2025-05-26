// src/app/[locale]/layout.tsx
import { NextIntlClientProvider } from "next-intl";
import "./globals.css";
import { AppProvider } from "@/components/app-provider";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "News App - Admin",
  description: "Admin panel for news app",
};

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {}

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AppProvider>
            <div className="flex">
              <aside className="w-64 bg-gray-800 text-white h-screen fixed top-0 left-0">
                <div className="p-4">
                  <Image
                    src="/logo.png"
                    alt="News App Logo"
                    width={120}
                    height={40}
                  />
                </div>
                <nav className="mt-6">
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="/admin"
                        className="block p-4 hover:bg-gray-700"
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/articles"
                        className="block p-4 hover:bg-gray-700"
                      >
                        Articles
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/accounts"
                        className="block p-4 hover:bg-gray-700"
                      >
                        Accounts
                      </Link>
                    </li>
                    <li>
                      <button className="block p-4 w-full text-left hover:bg-gray-700">
                        Logout
                      </button>
                    </li>
                  </ul>
                </nav>
              </aside>
              <main className="ml-64 p-8 w-full">{children}</main>
            </div>
          </AppProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
