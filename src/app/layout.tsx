import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ReactQueryProvider } from "@/components/providers";
import { SidebarProvider } from "@/components/sidebar-context";
import { Sidebar } from "@/components/sidebar2";
import { Header } from "@/components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            <SidebarProvider>
              <div className="flex h-screen overflow-hidden">
                <aside className="hidden md:block">
                  <Sidebar />
                </aside>
                <div className="flex flex-1 flex-col overflow-hidden">
                  <main className="flex-1 overflow-y-auto bg-muted/50">
                    {children}
                  </main>
                </div>
              </div>
            </SidebarProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
