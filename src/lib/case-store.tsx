import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  cases,
  defaultCaseKey,
  initialNotifications,
  type DoctorNotification,
  type PatientCase,
} from "./mock-data";

type CaseKey = keyof typeof cases;
export type Role = "nurse" | "doctor";

interface CaseContextValue {
  caseKey: CaseKey;
  setCaseKey: (k: CaseKey) => void;
  patientCase: PatientCase;
  theme: "light" | "dark";
  toggleTheme: () => void;

  role: Role;
  setRole: (r: Role) => void;

  notifications: DoctorNotification[];
  approveNotification: (id: string) => void;
  rejectNotification: (id: string) => void;
  requestInfoNotification: (id: string) => void;
  pushNotification: (n: Omit<DoctorNotification, "id" | "timestamp" | "status">) => void;

  pendingCount: number;
  activeEmergencyCount: number;
}

const CaseContext = createContext<CaseContextValue | null>(null);

export function CaseProvider({ children }: { children: React.ReactNode }) {
  const [caseKey, setCaseKey] = useState<CaseKey>(defaultCaseKey as CaseKey);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [role, setRole] = useState<Role>("nurse");
  const [notifications, setNotifications] = useState<DoctorNotification[]>(initialNotifications);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const t = localStorage.getItem("pratham-theme");
    if (t === "dark" || t === "light") setTheme(t);
    const r = localStorage.getItem("pratham-role");
    if (r === "nurse" || r === "doctor") setRole(r);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("pratham-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("pratham-role", role);
  }, [role]);

  const approveNotification = useCallback((id: string) => {
    setNotifications((curr) => curr.map((n) => (n.id === id ? { ...n, status: "Approved" } : n)));
  }, []);
  const rejectNotification = useCallback((id: string) => {
    setNotifications((curr) => curr.map((n) => (n.id === id ? { ...n, status: "Rejected" } : n)));
  }, []);
  const requestInfoNotification = useCallback((id: string) => {
    setNotifications((curr) => curr.map((n) => (n.id === id ? { ...n, status: "Needs Info" } : n)));
  }, []);
  const pushNotification = useCallback(
    (n: Omit<DoctorNotification, "id" | "timestamp" | "status">) => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      setNotifications((curr) => [
        {
          ...n,
          id: `ntf-${Math.random().toString(36).slice(2, 8)}`,
          timestamp: `${hh}:${mm}`,
          status: "Pending Approval",
        },
        ...curr,
      ]);
    },
    [],
  );

  const pendingCount = useMemo(
    () => notifications.filter((n) => n.status === "Pending Approval").length,
    [notifications],
  );
  const activeEmergencyCount = useMemo(
    () => notifications.filter((n) => n.severity === "critical" || n.severity === "high").length,
    [notifications],
  );

  const value = useMemo<CaseContextValue>(
    () => ({
      caseKey,
      setCaseKey,
      patientCase: cases[caseKey],
      theme,
      toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
      role,
      setRole,
      notifications,
      approveNotification,
      rejectNotification,
      requestInfoNotification,
      pushNotification,
      pendingCount,
      activeEmergencyCount,
    }),
    [
      caseKey,
      theme,
      role,
      notifications,
      approveNotification,
      rejectNotification,
      requestInfoNotification,
      pushNotification,
      pendingCount,
      activeEmergencyCount,
    ],
  );

  return <CaseContext.Provider value={value}>{children}</CaseContext.Provider>;
}

export function useCase() {
  const ctx = useContext(CaseContext);
  if (!ctx) throw new Error("useCase must be used within CaseProvider");
  return ctx;
}
