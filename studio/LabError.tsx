"use client";

import Link from "next/link";

import styles from "./lab-error.module.css";

export type LabErrorProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export function LabError({ error, retry }: LabErrorProps) {
  return (
    <main className={styles.panel} aria-labelledby="lab-error-title">
      <h1 id="lab-error-title">This view couldn’t render.</h1>
      <p>
        You can open another file while this one is being fixed, or retry after
        the next edit.
      </p>
      <div className={styles.actions}>
        <button type="button" onClick={retry}>
          Retry view
        </button>
        <button type="button" onClick={() => window.location.reload()}>
          Reload page
        </button>
        <Link href="/">Back to files</Link>
      </div>
      <details className={styles.details}>
        <summary>Error details</summary>
        <pre>{error.message || "An unexpected rendering error occurred."}</pre>
        {error.digest && <p>Reference: {error.digest}</p>}
      </details>
    </main>
  );
}
