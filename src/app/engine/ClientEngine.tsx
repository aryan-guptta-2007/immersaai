"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Background3D } from "@/components/Background3D";
import { PromptInput } from "@/components/PromptInput";
import { PreviewCanvas } from "@/components/PreviewCanvas";
import { GenerationLoader } from "@/components/GenerationLoader";

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [generatedFiles, setGeneratedFiles] = useState<Record<string, string> | null>(null);
  const [generationId, setGenerationId] = useState<string | null>(null);

  const handleGenerate = async (prompt: string) => {
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        let errorMessage = "";
        try {
          errorMessage = await response.text();
        } catch (e) { }

        console.error("API ERROR:", errorMessage);

        if (response.status === 403) {
          alert(errorMessage || "Free limit reached. Upgrade to Pro.");
        } else if (response.status === 504) {
          alert("Vercel Timeout (504). The AI took too long to generate code.");
        } else {
          alert(errorMessage || "API error occurred");
        }

        setIsGenerating(false);
        return;
      }

      const data = await response.json();

      if (data.success === false) {
        alert(data.error || "AI generation failed");
        setIsGenerating(false);
        return;
      }

      let parsedFiles: Record<string, string> = {};
      try {
        const payload = JSON.parse(data.output);
        parsedFiles = payload.files || payload;
      } catch (e) {
        console.error("Failed to parse JSON response payload:", data.output);
        throw new Error("AI returned malformed JSON project structure.");
      }

      setGeneratedFiles(parsedFiles);
      setGenerationId(data.id || "gen-" + Date.now());
      setGeneratedPrompt(prompt);
    } catch (error: any) {
      console.error("FULL ERROR:", error);
      alert(error?.message || "Unknown error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    setGeneratedPrompt(null);
    setGeneratedFiles(null);
    setGenerationId(null);
  };

  const handleRegenerateStyle = (theme: string) => {
    // Left empty for backwards compatibility for now since Sandpack runs internally
  };
  return (
    <main className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        {!generatedPrompt || !generatedFiles ? (
          <motion.div
            key="editor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.8 }}
            className="relative z-10 w-full max-w-5xl mx-auto px-4 flex flex-col items-center justify-center min-h-screen"
          >
            <div className="absolute inset-0 z-0">
              <Background3D theme="default" />
            </div>

            <div className="relative z-10 w-full text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium mb-8 backdrop-blur-md"
              >
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                ImmersaAI Engine v1.0
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-full max-w-4xl mx-auto flex flex-col items-center"
              >
                <h1 className="text-4xl md:text-5xl font-mono tracking-tighter mb-4 text-white uppercase">
                  AI Initialization Node
                </h1>

                <p className="text-sm md:text-base font-mono text-white/40 mb-12 max-w-2xl mx-auto uppercase tracking-widest">
                  {"// Provide brand parameters. System will auto-compile WebGL matrix."}
                </p>

                <div className="w-full relative min-h-[400px]">
                  <AnimatePresence mode="wait">
                    {isGenerating ? (
                      <motion.div
                        key="loader"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 w-full"
                      >
                        <GenerationLoader />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="input"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 w-full"
                      >
                        <PromptInput onSubmit={handleGenerate} isGenerating={false} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <PreviewCanvas
            key="preview"
            prompt={generatedPrompt}
            generatedFiles={generatedFiles}
            generationId={generationId || undefined}
            onRegenerate={handleRegenerate}
            onRegenerateStyle={handleRegenerateStyle as any}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
