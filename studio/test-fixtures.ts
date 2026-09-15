import type { CanvasPage } from "./types";
export const onboardingPages: CanvasPage[] = [
  {
    id: "welcome",
    title: "Welcome & workspace",
    boards: [
      {
        id: "guided",
        title: "01 · One step at a time",
        description: "A focused, guided setup",
        width: 960,
        height: 720,
      },
      {
        id: "workspace",
        title: "02 · Make it yours",
        description: "Workspace setup with a live preview",
        width: 1100,
        height: 720,
      },
      {
        id: "workspace-all",
        title: "02 · Make it yours — V2",
        description: "All 15 apps in your first workspace view",
        width: 1280,
        height: 1100,
        ideaId: "workspace",
      },
      {
        id: "goals",
        title: "03 · Start with a goal",
        description: "A personal path into the product",
        width: 390,
        height: 844,
      },
    ],
  },
  {
    id: "activation",
    title: "Activation",
    boards: [
      {
        id: "checklist",
        title: "01 · A clear next step",
        description: "A checklist inside the workspace",
        width: 1100,
        height: 760,
      },
      {
        id: "connect",
        title: "02 · Connect your website",
        description: "A focused installation flow",
        width: 960,
        height: 720,
      },
      {
        id: "invite",
        title: "03 · Better together",
        description: "Bring a teammate into the workspace",
        width: 390,
        height: 844,
      },
    ],
  },
];
