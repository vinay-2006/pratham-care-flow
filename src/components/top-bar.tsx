import { Moon, Sun, UserRound } from "lucide-react";
import { useCase } from "@/lib/case-store";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { EvidenceCompletenessPill } from "@/components/evidence-completeness-pill";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TopBar() {
  const { caseKey, setCaseKey, patientCase, theme, toggleTheme } = useCase();

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-background/85 px-3 backdrop-blur md:px-5">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-6" />

      <div className="hidden items-center gap-2 sm:flex">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted">
          <UserRound className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-xs font-medium">
            {patientCase.patient.name} · {patientCase.patient.age}{patientCase.patient.sex}
          </span>
          <span className="text-[10px] text-muted-foreground">
            Arrival {patientCase.patient.arrival} · ETA {patientCase.patient.eta}
          </span>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <EvidenceCompletenessPill level={patientCase.evidenceCompleteness} />

        <Select value={caseKey} onValueChange={(v) => setCaseKey(v as "primary" | "low")}>
          <SelectTrigger className="h-8 w-[160px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="primary">Demo: Primary case</SelectItem>
            <SelectItem value="low">Demo: Low-evidence case</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle theme"
          onClick={toggleTheme}
          className="h-8 w-8"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  );
}
