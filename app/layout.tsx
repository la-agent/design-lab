import { LabShell } from "@la-agent/design-lab/shell";
import type { ReactNode } from "react";

import { files } from "../.studio/catalog";
import config from "../studio.config";

import "@la-agent/design-lab/globals.css";
export const metadata = {
  title: "Design Lab",
  robots: { index: false, follow: false },
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LabShell files={files} config={config}>
          {children}
        </LabShell>
      </body>
    </html>
  );
}
