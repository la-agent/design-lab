import { StudioResult } from "@la-agent/design-lab/workspace";
import { notFound } from "next/navigation";

import { files } from "../../../../.studio/catalog";
export default async function Page({
  params,
}: {
  params: Promise<{ file: string }>;
}) {
  const { file: id } = await params;
  const file = files.find((item) => item.id === id);
  if (!file?.final) notFound();
  return <StudioResult file={file} />;
}
