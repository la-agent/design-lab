import { createLayoutHandlers } from "@la-agent/design-lab/layouts";

import { files } from "../../../.studio/catalog";
export const runtime = "nodejs";
export const { GET, PUT } = createLayoutHandlers({ files });
