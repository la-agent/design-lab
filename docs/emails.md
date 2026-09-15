# Email authoring and export

Use the installed `@react-email/components` version and its types. This starter pins the API tested here; don't copy imports from a newer React Email major without intentionally upgrading and testing it.

- Default-export a server-renderable email. Include Html, Head, Preview, Body, and a constrained Container. No client hooks, browser globals, script tags, app providers, or interactive web controls.
- Keep sample recipient data in the template or an adjacent fixture. Put subject, preview text, audience, and unresolved copy in the brief. The Html download contains the body document; subject and recipient configuration belong to the sending platform.
- Use email components and conservative inline styles. Use images with meaningful alt text and explicit sizes. A browser can display layouts that an email client doesn't support; preview at mobile and desktop widths, then test target inbox clients through the sending platform.
- Browser assets can use public URLs during exploration, but exported email images need reachable HTTPS URLs. Never ship localhost paths, relative image paths, or filesystem references. Check every CTA and personalization value.
- Don't embed the studio shell or capture the email as a single image. The generated preview endpoint and HTML export endpoint both call React Email's render on the same component. Plain text uses toPlainText on that HTML.
- HTML/Text links are in board chrome. Direct routes: `/api/exports/<design>/<version>` and the same URL with `?format=text`.
- Export doesn't send. No sender credentials or mailing service are included. Import the HTML into a platform that supports custom HTML, supply subject and recipient settings, and test before an authorized send.

## Local export check

With the dev server running, download preview and export to temporary files using curl. Compare their bytes. Download `?format=text` and inspect the links/text. Use the actual chosen port. Never claim an inbox test based only on this comparison.
