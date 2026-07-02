import { createBrowserRouter, Navigate } from "react-router";
import { ModuxHome } from "./components/modux/ModuxHome";
import { ModuxLayout } from "./components/modux/ModuxLayout";
import { StudyMode } from "./components/modux/StudyMode";
import { GuidedLearning } from "./components/modux/GuidedLearning";
import { ProgramMode } from "./components/modux/ProgramMode";
import { BrainstormMode } from "./components/modux/BrainstormMode";
import { WriteMode } from "./components/modux/WriteMode";
import { ModuxHistory } from "./components/modux/ModuxHistory";
import { ModuxFiles } from "./components/modux/ModuxFiles";
import { ModuxConnectors } from "./components/modux/ModuxConnectors";
import { ModuxSettings } from "./components/modux/ModuxSettings";
import { ModuxHelp } from "./components/modux/ModuxHelp";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: ModuxLayout,
    children: [
      { index: true, Component: ModuxHome },
      { path: "study", Component: StudyMode },
      { path: "study/guided", Component: GuidedLearning },
      { path: "program", Component: ProgramMode },
      { path: "brainstorm", Component: BrainstormMode },
      { path: "write", Component: WriteMode },
      { path: "history", Component: ModuxHistory },
      { path: "files", Component: ModuxFiles },
      { path: "connectors", Component: ModuxConnectors },
      { path: "settings", Component: ModuxSettings },
      { path: "help", Component: ModuxHelp },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
