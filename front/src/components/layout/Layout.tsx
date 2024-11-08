import {type FC, type ReactNode} from 'react'

interface LayoutProps {
    children: ReactNode
}

export const Layout: FC<LayoutProps> = ({children}) => {
    return (
        <div className="min-h-screen w-screen">
            <div className="grid grid-cols-10 gap-5">
                <header className="sticky top-0 bg-background z-50 col-start-3 col-span-6">
                    <div className="pt-4 pb-4">
                        <a href="/" className="cursor-pointer hover:opacity-80 transition-opacity">
                            <h1 className="text-3xl font-bold">GADFLOG</h1>
                        </a>
                    </div>
                    <div className="h-4"/>
                </header>
                <main className="col-start-3 col-span-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
