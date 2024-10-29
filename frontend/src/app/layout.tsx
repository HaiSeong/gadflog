import {Inter} from "next/font/google";
import "./globals.css";
import {Toaster} from "@/components/ui/toaster";

const inter = Inter({subsets: ["latin"]});

export default function RootLayout({children,}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <div className="min-h-screen">
            <header className="sticky top-0 bg-white">
                <div className="grid grid-cols-10 gap-5">
                    <div className="col-start-4 col-span-4 p-4">
                        <h1 className="text-3xl font-bold">GADFLOG</h1>
                    </div>
                </div>
            </header>
            <main className="grid grid-cols-10 gap-5">
                <div className="col-start-4 col-span-4 py-4">
                    {children}
                </div>
            </main>
        </div>
        <Toaster/>
        </body>
        </html>
    );
}
