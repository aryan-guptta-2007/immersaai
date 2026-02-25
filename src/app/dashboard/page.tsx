import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import Link from "next/link";

export default async function Dashboard() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) redirect("/");

    const projects = await prisma.generation.findMany({
        where: { userId: (session.user as any).id },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto mt-20">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-4xl font-bold">Your Projects</h1>
                    <Link href="/engine" className="px-6 py-2 bg-primary text-black font-semibold rounded-full hover:bg-white transition-colors">
                        New Generation
                    </Link>
                </div>

                {projects.length === 0 ? (
                    <div className="text-center text-white/50 py-20 border border-white/10 rounded-2xl bg-white/5">
                        <p className="text-xl mb-4">No projects yet.</p>
                        <p>Go to the engine to generate your first experience.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {projects.map((p) => (
                            <div key={p.id} className="p-6 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
                                <h3 className="text-xl font-bold mb-2">{p.prompt}</h3>
                                <div className="flex gap-4 text-sm text-white/50">
                                    <span>Theme: {p.theme}</span>
                                    <span>Created: {new Date(p.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
