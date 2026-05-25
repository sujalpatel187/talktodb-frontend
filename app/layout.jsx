import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "TalkToDB — NL to SQL Dashboard",
  description: "Convert natural language to SQL using AI and semantic search",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body style={{ background: "#f8fafc", color: "#0f172a" }}>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 flex flex-col" style={{ marginLeft: "0" }}>
            <div className="md:ml-64 flex-1 flex flex-col">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
