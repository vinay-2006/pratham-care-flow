import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { cases, defaultCaseKey, type PatientCase } from "./mock-data";

type CaseKey = keyof typeof cases;

interface CaseContextValue {
  caseKey: CaseKey;
  setCaseKey: (k: CaseKey) => void;
  patientCase: PatientCase;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const CaseContext = createContext<CaseContextValue | null>(null);

export function CaseProvider({ children }: { children: React.ReactNode }) {
  const [caseKey, setCaseKey] = useState<CaseKey>(defaultCaseKey as CaseKey);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("pratham-theme") : null;
    if (stored === "dark" || stored === "light") setTheme(stored);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("pratham-theme", theme);
  }, [theme]);

  const value = useMemo<CaseContextValue>(
    () => ({
      caseKey,
      setCaseKey,
      patientCase: cases[caseKey],
      theme,
      toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    }),
    [caseKey, theme],
  );

  return <CaseContext.Provider value={value}>{children}</CaseContext.Provider>;
}

export function useCase() {
  const ctx = useContext(CaseContext);
  if (!ctx) throw new Error("useCase must be used within CaseProvider");
  return ctx;
}
