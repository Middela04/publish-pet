import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Publish Pet - Journal Submission Checker",
  description:
    "AI-powered tool that checks your research paper against journal submission guidelines for formatting, structure, word limits, and citation compliance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
