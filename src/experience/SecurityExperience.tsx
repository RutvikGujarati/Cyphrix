/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { useReducedMotion } from "framer-motion";

export type SceneChapter =
  | "hero"
  | "services"
  | "projects"
  | "audit"
  | "research"
  | "partner"
  | "contact";

export type DeviceTier = "desktop" | "tablet" | "mobile";

export type SecuritySceneState = {
  chapter: SceneChapter;
  progress: number;
  focusId: number | null;
  intensity: number;
  route: string;
  reducedMotion: boolean;
  deviceTier: DeviceTier;
};

type ScenePatch = Partial<Pick<SecuritySceneState, "chapter" | "progress" | "focusId" | "intensity">>;

type SecurityExperienceValue = {
  scene: SecuritySceneState;
  updateScene: (patch: ScenePatch) => void;
  focusScene: (focusId: number | null, intensity?: number) => void;
};

const SecurityExperienceContext = createContext<SecurityExperienceValue | null>(null);

const chapterForRoute = (route: string): SceneChapter => {
  if (route === "/services") return "services";
  if (route === "/projects") return "projects";
  if (route === "/research") return "research";
  if (route === "/flowofaudit") return "audit";
  if (route === "/partnerwithus") return "partner";
  if (route === "/inquiry" || route === "/request-audit") return "contact";
  return "hero";
};

const getDeviceTier = (): DeviceTier => {
  if (typeof window === "undefined") return "desktop";
  if (window.matchMedia("(max-width: 720px)").matches) return "mobile";
  if (window.matchMedia("(max-width: 1100px)").matches) return "tablet";
  return "desktop";
};

export function SecurityExperienceProvider({ pathname, children }: PropsWithChildren<{ pathname: string }>) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [scene, setScene] = useState<SecuritySceneState>({
    chapter: chapterForRoute(pathname),
    progress: 0,
    focusId: null,
    intensity: 0.35,
    route: pathname,
    reducedMotion: prefersReducedMotion,
    deviceTier: getDeviceTier(),
  });

  useEffect(() => {
    const updateDevice = () => setScene((current) => ({ ...current, deviceTier: getDeviceTier() }));
    updateDevice();
    window.addEventListener("resize", updateDevice, { passive: true });
    return () => window.removeEventListener("resize", updateDevice);
  }, []);

  const updateScene = useCallback((patch: ScenePatch) => {
    setScene((current) => ({
      ...current,
      route: pathname,
      reducedMotion: prefersReducedMotion,
      ...patch,
      progress: patch.progress === undefined ? current.progress : Math.min(1, Math.max(0, patch.progress)),
      intensity: patch.intensity === undefined ? current.intensity : Math.min(1, Math.max(0, patch.intensity)),
    }));
  }, [pathname, prefersReducedMotion]);

  const focusScene = useCallback((focusId: number | null, intensity = 0.8) => {
    updateScene({ focusId, intensity: focusId === null ? 0.35 : intensity });
  }, [updateScene]);

  const resolvedScene = useMemo(() => scene.route === pathname && scene.reducedMotion === prefersReducedMotion
    ? scene
    : { ...scene, route: pathname, chapter: chapterForRoute(pathname), progress: 0, focusId: null, reducedMotion: prefersReducedMotion },
  [scene, pathname, prefersReducedMotion]);
  const value = useMemo(() => ({ scene: resolvedScene, updateScene, focusScene }), [resolvedScene, updateScene, focusScene]);
  return <SecurityExperienceContext.Provider value={value}>{children}</SecurityExperienceContext.Provider>;
}

export function useSecurityExperience() {
  const value = useContext(SecurityExperienceContext);
  if (!value) throw new Error("useSecurityExperience must be used inside SecurityExperienceProvider");
  return value;
}
