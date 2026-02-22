import { BrandContext } from "@/components/PreviewCanvas";
import prisma from "@/lib/db";
import OpenAI from "openai";

export type AIProvider = 'mock' | 'openai' | 'claude';

// The Orchestrator class gives the owner the power to swap models instantly
export class AIOrchestrator {
    private defaultProvider: AIProvider;
    private openai: OpenAI | null = null;

    constructor(provider: AIProvider = 'openai') {
        this.defaultProvider = provider;

        if (process.env.OPENAI_API_KEY) {
            this.openai = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY,
            });
        } else {
            console.warn("[AI Orchestrator] No OPENAI_API_KEY found. Falling back to mock.");
            this.defaultProvider = 'mock';
        }
    }

    async generateExperience(prompt: string, userId?: string): Promise<BrandContext> {
        let result: BrandContext;

        console.log(`[AI Orchestrator] Generating experience using provider: ${this.defaultProvider}`);

        if (this.defaultProvider === 'openai' && this.openai) {
            result = await this.generateOpenAIExperience(prompt);
        } else if (this.defaultProvider === 'mock') {
            result = this.generateMockExperience(prompt);
            // Simulate network request
            await new Promise((resolve) => setTimeout(resolve, 2000));
        } else {
            throw new Error(`Provider ${this.defaultProvider} not implemented yet`);
        }

        // [OWNER CONTROL] Log generation silently to build the proprietary dataset
        try {
            await prisma.generation.create({
                data: {
                    prompt,
                    theme: result.theme,
                    content: JSON.stringify(result),
                    userId: userId || null,
                }
            });
            console.log(`[AI Orchestrator] Experience logged to database successfully.`);
        } catch (e) {
            console.error("[AI Orchestrator] Failed to log generation:", e);
        }

        return result;
    }

    private async generateOpenAIExperience(prompt: string): Promise<BrandContext> {
        if (!this.openai) throw new Error("OpenAI client not initialized");

        const systemPrompt = `You are the ImmersaAI core generation engine. 
You design cinematic WebGL website experiences based on user prompts.
You MUST respond with a perfectly formatted JSON object.

The JSON schema must be exactly this:
{
  "theme": "string, MUST BE EXACTLY ONE OF: cyber, luxury, neural, or default",
  "headline": "string, a very catchy, short marketing headline (max 6 words)",
  "subheadline": "string, actionable secondary text explaining the value proposition",
  "features": [
    { "title": "string, feature name", "description": "string, short compelling description" },
    { "title": "string, feature name", "description": "string, short compelling description" },
    { "title": "string, feature name", "description": "string, short compelling description" }
  ]
}

Ensure exactly 3 features are provided. Optimize for dramatic, high-end startup copy.`;

        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: `Design a website experience for: ${prompt}` }
                ],
                response_format: { type: "json_object" },
                temperature: 0.7,
            });

            const jsonString = response.choices[0].message.content;
            if (!jsonString) throw new Error("No content generated");

            const parsed = JSON.parse(jsonString);

            return {
                theme: ['cyber', 'luxury', 'neural', 'default'].includes(parsed.theme) ? parsed.theme : 'default',
                headline: parsed.headline || "Digital Experience",
                subheadline: parsed.subheadline || "Welcome to the future.",
                features: parsed.features || []
            };

        } catch (error) {
            console.error("[AI Orchestrator] OpenAI Generation Failed:", error);
            console.log("[AI Orchestrator] Falling back to mock data...");
            return this.generateMockExperience(prompt);
        }
    }

    private generateMockExperience(prompt: string): BrandContext {
        const p = prompt.toLowerCase();

        if (p.includes("cyber") || p.includes("security") || p.includes("shield")) {
            return {
                theme: "cyber",
                headline: "Fortifying the Digital Frontier",
                subheadline: "AI-powered zero-trust infrastructure for modern enterprises.",
                features: [
                    { title: "Quantum Encryption", description: "Unhackable data pipelines secured by military-grade quantum protocols." },
                    { title: "Zero-Trust Architecture", description: "Trust nothing. Verify everything. Our neural net monitors every micro-interaction." },
                    { title: "Automated Threat Response", description: "Neutralize anomalies in milliseconds before they compromise your perimeter." }
                ]
            };
        }

        if (p.includes("ai") || p.includes("neural") || p.includes("brain") || p.includes("intelligence")) {
            return {
                theme: "neural",
                headline: "Intelligence, Evolved.",
                subheadline: "Unleash super-intelligent agents to automate your entire cognitive workflow.",
                features: [
                    { title: "Cognitive Processing", description: "Our proprietary neural core handles reasoning faster than human thought." },
                    { title: "Generative Workflows", description: "From prompt to execution in under a second without human intervention." },
                    { title: "Continuous Learning", description: "The system adapts and evolves from your data, getting smarter every day." }
                ]
            };
        }

        if (p.includes("luxury") || p.includes("premium") || p.includes("agency")) {
            return {
                theme: "luxury",
                headline: "Elegance in Motion.",
                subheadline: "Crafting bespoke digital experiences for the world's most exclusive brands.",
                features: [
                    { title: "Bespoke Design", description: "Every pixel is carefully placed to evoke emotion and desire." },
                    { title: "Fluid Interaction", description: "Silky smooth animations that make interacting a pure joy." },
                    { title: "Exclusive Aesthetics", description: "A visual language that commands attention and premium value." }
                ]
            };
        }

        // Default
        return {
            theme: "default",
            headline: "The Future of Digital Experience",
            subheadline: `Based on your idea: "${prompt}". A next-generation platform built for scale.`,
            features: [
                { title: "Dynamic Architecture", description: "Built on serverless edge networks for infinite scalability and speed." },
                { title: "Intelligent UX", description: "Anticipating user needs with predictive design patterns." },
                { title: "Lightning Fast", description: "Optimized delivery ensuring sub-second load times globally." }
            ]
        };
    }
}

// Export a singleton instance initialized to openai
export const orchestrator = new AIOrchestrator('openai');
