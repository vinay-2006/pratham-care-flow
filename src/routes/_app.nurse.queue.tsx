import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader } from "@/components/section-header";
import { PatientQueueRow } from "@/components/patient-queue-row";
import { Card, CardContent } from "@/components/ui/card";
import { patientQueue, type PatientStatus } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/nurse/queue")({
  head: () => ({
    meta: [
      { title: "Patient Queue — PRATHAM" },
      { name: "description", content: "Full emergency patient queue grouped by status." },
    ],
  }),
  component: NurseQueue,
});

const GROUPS: PatientStatus[] = [
  "Intake Pending",
  "Awaiting Doctor Approval",
  "Investigation Approved",
  "Investigation Running",
  "Results Available",
];

function NurseQueue() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-8 md:px-8">
      <SectionHeader
        eyebrow="Nurse station"
        title="Patient Queue"
        description="Grouped by workflow status across the emergency floor."
      />

      <div className="mt-8 space-y-6">
        {GROUPS.map((g) => {
          const items = patientQueue.filter((p) => p.status === g);
          if (!items.length) return null;
          return (
            <section key={g}>
              <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {g} · {items.length}
              </h2>
              <Card>
                <CardContent className="p-0">
                  <ul className="divide-y">
                    {items.map((p) => (
                      <PatientQueueRow key={p.id} p={p} />
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </section>
          );
        })}
      </div>
    </div>
  );
}
