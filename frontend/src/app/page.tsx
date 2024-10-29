import {Home} from "@/app/pages/home";

export default function Page() {
    return (
        <main>
            <div className="grid grid-cols-10 gap-5">
                <div className="col-start-4 col-span-4 p-4">
                    <h1 className="text-3xl">GADFLOG</h1>
                    <div className="h-7"/>
                    <Home/>
                </div>
            </div>

        </main>
    );
}
