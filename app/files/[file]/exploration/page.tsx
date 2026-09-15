import { StudioFileCanvas } from "@la-agent/design-lab/workspace";
import { notFound } from "next/navigation";

import { files } from "../../../../.studio/catalog";
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ file: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { file: id } = await params;
  const file = files.find((item) => item.id === id);
  if (!file) notFound();
  return (
    <StudioFileCanvas file={file} initialPageId={(await searchParams).page} />
  );
}
