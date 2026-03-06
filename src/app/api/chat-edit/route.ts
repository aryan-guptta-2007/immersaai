export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
    try {
        const { prompt, currentContext } = await req.json();

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
        });

        const promptText = `
You are an expert AI Web Developer. You are modifying an existing website layout structure.

Current JSON:
${JSON.stringify(currentContext, null, 2)}

User request for modification: ${prompt}

Return ONLY the updated JSON layout structure. Keep the exact same schema structure.
Ensure you return JSON ONLY:

{
 "theme": "cyber",
 "pages": [
   {
     "name": "landing",
     "sections": [
       {
         "type": "hero",
         "headline": "string",
         "subheadline": "string",
         "cta": "string"
       },
       // ... other existing or new sections based on request
     ]
   }
 ]
}
`;

        const result = await model.generateContent(promptText);
        const text = result.response.text();

        // Clean markdown backticks if present before parsing
        const cleanedText = text.replace(/^```json\n|\n```$/g, '').trim();
        const data = JSON.parse(cleanedText);

        return Response.json(data);
    } catch (error) {
        console.error(error);
        return Response.json({
            success: false,
            error: "Chat edit compilation failed",
        }, { status: 500 });
    }
}
