import Groq from "groq-sdk";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return Response.json({ error: "Prompt missing" }, { status: 400 });
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `
You are an expert frontend developer specializing in futuristic 3D websites.

STRICT RULES:
- Use React + TailwindCSS + Framer Motion + Three.js (react-three-fiber)
- Create cinematic, animated, modern UI
- Include 3D elements, gradients, glassmorphism, glowing effects
- Use animations (motion, transitions, hover effects)
- Avoid plain layouts
- Make it look like a premium startup landing page
- Output ONLY valid React TSX code
- No explanation
- No markdown
- Start with: export default function App()
`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.1-8b-instant",
    });

    const text = completion.choices[0]?.message?.content || "";

    const cleanCode = text
      ?.replace(/```tsx/g, "")
      ?.replace(/```jsx/g, "")
      ?.replace(/```ts/g, "")
      ?.replace(/```js/g, "")
      ?.replace(/```/g, "")
      ?.trim();

    return Response.json({
      success: true,
      output: cleanCode,
    });

  } catch (error: any) {
    console.error("API ERROR:", error);

    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
