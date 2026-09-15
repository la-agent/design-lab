import { createDecisionHandlers } from "@la-agent/design-lab/decisions";

import { files } from "../../../.studio/catalog";
export const runtime = "nodejs";
export const { GET, PUT } = createDecisionHandlers({ files });
