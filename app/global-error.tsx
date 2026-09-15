"use client";

import { RouteFailure } from "@la-agent/design-lab/route-error";

export default function GlobalError({ retry }: { retry: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <RouteFailure retry={retry} />
      </body>
    </html>
  );
}
