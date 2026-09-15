import { defaultFilePath } from "@la-agent/design-lab/files";
import { notFound, redirect } from "next/navigation";

import { files } from "../../../.studio/catalog";
export default async function Page({
  params,
}: {
  params: Promise<{ file: string }>;
}) {
  const { file: id } = await params;
  const file = files.find((item) => item.id === id);
  if (!file) notFound();
  redirect(defaultFilePath(file));
}
