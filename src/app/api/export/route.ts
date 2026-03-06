export const dynamic = "force-dynamic";

import JSZip from "jszip";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { brandContext } = await req.json();

    const zip = new JSZip();

    // 1. package.json
    zip.file("package.json", JSON.stringify({
      name: "immersa-ai-export",
      version: "0.1.0",
      private: true,
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
        lint: "next lint"
      },
      dependencies: {
        "react": "^18",
        "react-dom": "^18",
        "next": "14.2.5",
        "framer-motion": "^11.0.0",
        "lucide-react": "^0.300.0"
      },
      devDependencies: {
        "typescript": "^5",
        "@types/node": "^20",
        "@types/react": "^18",
        "@types/react-dom": "^18",
        "postcss": "^8",
        "tailwindcss": "^3.4.1"
      }
    }, null, 2));

    // 2. tailwind.config.ts
    zip.file("tailwind.config.ts", `
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0ff"
      }
    },
  },
  plugins: [],
}
export default config
    `.trim());

    // 3. globals.css
    zip.file("app/globals.css", `
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: rgb(0, 255, 255);
  --primary-rgb: 0, 255, 255;
}

body {
  background-color: #000;
  color: #fff;
}
    `.trim());

    // 4. layout.tsx
    zip.file("app/layout.tsx", `
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '${brandContext?.headline || 'AI Generated Site'}',
  description: '${brandContext?.subheadline || 'Built with ImmersaAI Editor'}',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
    `.trim());

    // 5. Build dynamic page.tsx with generated sections mapping
    const sections = brandContext?.pages?.[0]?.sections || [];
    let imports: string[] = [];
    const uniqueTypes = new Set<string>(sections.map((s: any) => s.type));

    uniqueTypes.forEach((type: any) => {
      const Capitalized = type.charAt(0).toUpperCase() + type.slice(1);
      imports.push(`import { ${Capitalized} } from '@/components/sections/${Capitalized}';`);
    });

    zip.file("app/page.tsx", `
import React from 'react';
${imports.join('\n')}

export default function Home() {
  const context = ${JSON.stringify(brandContext, null, 2)};
  const sections = context.pages?.[0]?.sections || [];
  
  const renderSection = (section: any, idx: number) => {
    switch (section.type) {
${Array.from(uniqueTypes).map((type: any) => `
      case "${type}":
        return <${type.charAt(0).toUpperCase() + type.slice(1)} key={idx} {...section} />;
`).join('')}
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-black overflow-hidden relative">
      {sections.map(renderSection)}
    </main>
  )
}
    `.trim());

    // 6. Generate mock scaffolding for the individual section components
    uniqueTypes.forEach((type: any) => {
      const Capitalized = type.charAt(0).toUpperCase() + type.slice(1);
      zip.file(`components/sections/${Capitalized}.tsx`, `
import React from 'react';

export function ${Capitalized}(props: any) {
  return (
    <section className="py-24 px-4 text-center border-b border-white/10 z-10 relative">
      <h2 className="text-4xl font-bold mb-8 text-white">${Capitalized} Component</h2>
      <pre className="text-left bg-white/5 p-6 rounded-xl text-xs overflow-auto max-w-3xl mx-auto border border-white/10 text-white/70">
        {JSON.stringify(props, null, 2)}
      </pre>
    </section>
  )
}
      `.trim());
    });

    const buffer = await zip.generateAsync({ type: "nodebuffer" });

    return new NextResponse(buffer as any, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="immersa-ai-export.zip"',
      },
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
