"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Download, Share2, RefreshCw, Rocket, Sparkles, Loader2 } from "lucide-react";
import { Background3D } from "./Background3D";
import { useRef, useState } from "react";
import { PricingModal } from "./PricingModal";
import { ShareModal } from "./ShareModal";
import { useSession } from "next-auth/react";
import { Sandpack } from "@codesandbox/sandpack-react";
import { ChatEditor } from "./ChatEditor";

interface PreviewCanvasProps {
    prompt: string;
    generatedFiles: Record<string, string>;
    generationId?: string;
    onRegenerate: () => void;
    onRegenerateStyle: (theme: string) => void;
}

export function PreviewCanvas({ prompt, generatedFiles, generationId, onRegenerate, onRegenerateStyle }: PreviewCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const [showPricing, setShowPricing] = useState(false);
    const [pricingAction, setPricingAction] = useState<'export' | 'deploy'>('export');
    const [showShare, setShowShare] = useState(false);
    const { data: session } = useSession();

    // Local code state updated by ChatEditor AI edits. Defaulting to Main App for single-file edits.
    const [localCode, setLocalCode] = useState<string>(generatedFiles["/App.tsx"] || "");
    const [isEditing, setIsEditing] = useState(false);

    const handleChatEdit = async (promptMsg: string, currentCode: string) => {
        setIsEditing(true);
        // We will build a specific chat-edit endpoint for code strings shortly.
        // For now, re-trigger full generation with combined prompt contexts.
        try {
            const res = await fetch("/api/generate-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: `Modify this code: ${currentCode}\n\nModification Request: ${promptMsg}` }),
            });
            if (res.ok) {
                const updatedCode = await res.json();
                setLocalCode(updatedCode.code);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsEditing(false);
        }
    };

    // Transform the Gemini JSON multi-file map into Sandpack's accepted internal virtual file state
    const sandpackFiles: Record<string, any> = {
        "/public/index.html": {
            code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`
        }
    };

    // Dynamically inject all AI-generated files
    Object.entries(generatedFiles).forEach(([filePath, fileCode]) => {
        // AI edits override the generated App file 
        const isApp = filePath === "/App.tsx" || filePath === "App.tsx";
        const targetPath = filePath.startsWith("/") ? filePath : `/${filePath}`;

        sandpackFiles[targetPath] = {
            code: isApp && localCode ? localCode : fileCode,
            active: isApp
        };
    });

    const [showExportSuccess, setShowExportSuccess] = useState(false);

    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        if ((session?.user as any)?.plan !== "PRO" && false) { // Removing hard PRO lock for this implementation just to test it
            setPricingAction('export');
            setShowPricing(true);
            return;
        }

        setIsExporting(true);
        try {
            // Export functionality will be rebuilt to pipe raw Sandpack files.
            // Leaving shell logic here but removing `localContext` reference for now.
            const res = await fetch("/api/export", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ brandContext: {} })
            });

            if (!res.ok) throw new Error("Export failed");

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `immersa-ai-export.zip`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            setShowExportSuccess(true);
            setTimeout(() => setShowExportSuccess(false), 5000);
        } catch (error) {
            console.error(error);
            alert("Export compilation failed");
        } finally {
            setIsExporting(false);
        }
    };

    const handleDeploy = () => {
        if ((session?.user as any)?.plan === "PRO") {
            setShowExportSuccess(true);
            setTimeout(() => setShowExportSuccess(false), 5000);
            return;
        }
        setPricingAction('deploy');
        setShowPricing(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-black overflow-hidden flex flex-col"
        >
            <PricingModal
                isOpen={showPricing}
                onClose={() => setShowPricing(false)}
                actionType={pricingAction}
                generationId={generationId}
            />
            <ShareModal
                isOpen={showShare}
                onClose={() => setShowShare(false)}
                siteUrl="https://immersa.ai/site/preview-demo"
            />

            {/* Post-Purchase / Pro Action Success Overlay */}
            <AnimatePresence>
                {showExportSuccess && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 50 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] glass-panel px-8 py-6 rounded-2xl border border-primary/30 flex items-center justify-center flex-col shadow-[0_20px_60px_rgba(var(--primary-rgb),0.2)] bg-black/90 backdrop-blur-3xl overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 opacity-50 pointer-events-none" />
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                            <Sparkles className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">Creator Engine Activated.</h3>
                        <p className="text-sm font-mono text-white/50 mb-6 uppercase tracking-widest">Welcome to PRO Mode.</p>

                        <div className="flex items-center gap-3 w-full bg-white/5 p-3 rounded-lg border border-white/10">
                            <div className="w-8 h-8 rounded bg-black/50 flex items-center justify-center border border-white/5">
                                <Rocket className="w-4 h-4 text-white/70" />
                            </div>
                            <div className="flex-1">
                                <div className="text-xs text-white/40 font-mono tracking-wider mb-1">Compiling React Bundle...</div>
                                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 4.5, ease: "linear" }}
                                        className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.8)]"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.header
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="bg-black/90 backdrop-blur-xl sticky top-0 z-50 px-4 py-3 flex items-center justify-between border-b border-white/10 shadow-2xl"
            >
                {/* Left Side: System Context */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 pr-6 border-r border-white/10">
                        <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center">
                            <div className="w-3 h-3 rounded-sm bg-black" />
                        </div>
                        <span className="text-sm font-bold tracking-tight uppercase text-white">SYS._NODE</span>
                    </div>
                    <div className="hidden md:flex flex-col">
                        <span className="text-[10px] text-white/40 uppercase font-mono tracking-widest mb-0.5">Active Directive</span>
                        <span className="text-xs text-white/80 font-mono truncate max-w-[300px]">{prompt}</span>
                    </div>
                </div>

                {/* Right Side: Actions & Theme Config */}
                <div className="flex items-center gap-4">
                    {/* Integrated Theme Toggle */}
                    <div className="hidden lg:flex items-center bg-white/5 rounded-lg p-1 border border-white/10 mr-4">
                        {(['default', 'cyber', 'luxury', 'neural'] as const).map((theme) => (
                            <button
                                key={theme}
                                onClick={() => onRegenerateStyle(theme)}
                                className={`px-3 py-1.5 rounded-md text-xs font-mono uppercase tracking-widest transition-all ${theme === 'default'
                                    ? 'bg-white/20 text-white shadow-sm'
                                    : 'text-white/40 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {theme === 'default' ? 'Modern' : theme}
                            </button>
                        ))}
                    </div>

                    <div className="h-4 w-px bg-white/10 hidden md:block mr-2" />

                    <div className="flex items-center gap-2">
                        <button
                            onClick={onRegenerate}
                            title="Reroll Generation"
                            className="p-2 rounded-md bg-transparent hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setShowShare(true)}
                            title="Share Node"
                            className="p-2 rounded-md bg-transparent hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                        >
                            <Share2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleExport}
                            disabled={isExporting}
                            className="flex items-center gap-2 px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-xs text-white font-mono uppercase tracking-widest disabled:opacity-50"
                        >
                            {isExporting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                            <span className="hidden md:inline">{isExporting ? "Compiling..." : "Export Zip"}</span>
                        </button>
                        <button
                            onClick={handleDeploy}
                            className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary hover:bg-primary/90 transition-colors text-xs text-black font-mono font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"
                        >
                            <Rocket className="w-3 h-3" />
                            <span className="hidden md:inline">Deploy</span>
                        </button>
                    </div>
                </div>
            </motion.header>

            <div className="flex-1 w-full relative overflow-hidden bg-[#151515]">
                {/* Dynamically Render Virtual DOM Output generated by AI via Sandpack */}
                <Sandpack
                    template="react-ts"
                    theme="dark"
                    files={sandpackFiles}
                    customSetup={{
                        dependencies: {
                            "framer-motion": "latest",
                            "lucide-react": "latest",
                            "tailwindcss": "latest",
                            "postcss": "latest",
                            "autoprefixer": "latest",
                            "@react-three/fiber": "latest",
                            "@react-three/drei": "latest",
                            "three": "latest"
                        }
                    }}
                    options={{
                        showNavigator: false,
                        showTabs: false,
                        showLineNumbers: false,
                        editorHeight: "100vh",
                        classes: {
                            "sp-layout": "!h-[calc(100vh-64px)] !rounded-none !border-none",
                            "sp-preview-container": "!h-[calc(100vh-64px)] !bg-transparent",
                            "sp-preview-iframe": "!h-[calc(100vh-64px)] !min-h-[calc(100vh-64px)]"
                        }
                    }}
                />

                {/* Watermark for free tiers */}
                {(!session?.user || (session.user as any)?.plan !== "PRO") && (
                    <div className="absolute bottom-6 right-6 z-50 glass-panel px-4 py-2 flex items-center gap-2 rounded-full border border-white/10 bg-black/60 backdrop-blur-md shadow-2xl pointer-events-none select-none">
                        <Sparkles className="w-3 h-3 text-primary" />
                        <span className="font-mono text-[10px] text-white/80 uppercase tracking-widest">Built with ImmersaAI Editor</span>
                    </div>
                )}
            </div>

            {/* AI Live Editor Chat Overlay */}
            <ChatEditor
                isUpdating={isEditing}
                currentContext={localCode as any}
                onUpdateParams={handleChatEdit}
            />

        </motion.div>
    );
}
