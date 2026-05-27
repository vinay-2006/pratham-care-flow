import { Check, HelpCircle, X, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SeverityBadge } from "@/components/severity-badge";
import { cn } from "@/lib/utils";
import { useCase } from "@/lib/case-store";
import type { DoctorNotification } from "@/lib/mock-data";
import { toast } from "sonner";

const urgencyStyles: Record<DoctorNotification["urgency"], string> = {
  Critical: "border-l-[var(--color-severity-critical)]",
  Urgent: "border-l-[var(--color-severity-high)]",
  Routine: "border-l-[var(--color-severity-moderate)]",
};

const statusBadge: Record<DoctorNotification["status"], string> = {
  "Pending Approval": "bg-muted text-muted-foreground",
  Approved: "bg-[var(--color-severity-low-soft)] text-[var(--color-severity-low)]",
  Rejected: "bg-[var(--color-severity-critical-soft)] text-[var(--color-severity-critical)]",
  "Needs Info":
    "bg-[var(--color-severity-moderate-soft)] text-[color-mix(in_oklab,var(--color-severity-moderate)_55%,black)] dark:text-[var(--color-severity-moderate)]",
};

export function NotificationCard({ n }: { n: DoctorNotification }) {
  const { approveNotification, rejectNotification, requestInfoNotification } = useCase();
  const pending = n.status === "Pending Approval";

  return (
    <Card className={cn("overflow-hidden border-l-4", urgencyStyles[n.urgency])}>
      <CardContent className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-display text-base font-semibold">
                {n.patientName}
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  · {n.age}{n.sex}
                </span>
              </p>
              <SeverityBadge severity={n.severity}>{n.urgency}</SeverityBadge>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                  statusBadge[n.status],
                )}
              >
                {n.status}
              </span>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Symptoms: <span className="text-foreground">{n.symptoms.join(", ")}</span>
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Vitals: <span className="font-mono text-foreground">{n.vitalsSummary}</span>
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span className="font-mono">{n.timestamp}</span>
          </div>
        </div>

        <div className="mt-4 rounded-md border bg-muted/30 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            System-recommended investigations
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {n.recommendedInvestigations.map((inv) => (
              <span
                key={inv}
                className="rounded-md border bg-background px-2 py-1 text-xs font-medium"
              >
                {inv}
              </span>
            ))}
          </div>
        </div>

        {pending && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              onClick={() => {
                approveNotification(n.id);
                toast.success("Investigations approved", {
                  description: `${n.patientName} · ${n.recommendedInvestigations.length} orders released.`,
                });
              }}
            >
              <Check className="mr-1.5 h-3.5 w-3.5" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                rejectNotification(n.id);
                toast("Request rejected", { description: n.patientName });
              }}
            >
              <X className="mr-1.5 h-3.5 w-3.5" />
              Reject
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                requestInfoNotification(n.id);
                toast("More info requested", { description: n.patientName });
              }}
            >
              <HelpCircle className="mr-1.5 h-3.5 w-3.5" />
              Request more info
            </Button>
          </div>
        )}

        {!pending && (
          <p className="mt-4 text-[11px] text-muted-foreground">
            System-generated · No nurse manually forwarded this request.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
