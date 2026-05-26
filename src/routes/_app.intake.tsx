import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Ambulance, Send } from "lucide-react";
import { useCase } from "@/lib/case-store";
import { SectionHeader } from "@/components/section-header";
import { SeverityBadge } from "@/components/severity-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MockUploadDropzone } from "@/components/mock-upload-dropzone";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/intake")({
  head: () => ({
    meta: [
      { title: "Emergency Intake — PRATHAM" },
      { name: "description", content: "Capture vitals, symptoms, and ambulance context in transit." },
    ],
  }),
  component: IntakePage,
});

const SYMPTOMS = [
  "Chest Pain",
  "Breathlessness",
  "Trauma",
  "Bleeding",
  "Unconsciousness",
  "Neurological Symptoms",
];

function IntakePage() {
  const { patientCase } = useCase();
  const [selected, setSelected] = useState<string[]>(patientCase.symptoms);

  const severity = useMemo(() => {
    const count = selected.length;
    if (selected.includes("Unconsciousness") || count >= 4) return "critical" as const;
    if (count >= 2) return "high" as const;
    if (count === 1) return "moderate" as const;
    return "low" as const;
  }, [selected]);

  const toggle = (s: string) =>
    setSelected((curr) => (curr.includes(s) ? curr.filter((x) => x !== s) : [...curr, s]));

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 md:px-8">
      <SectionHeader
        eyebrow="Stage 1 · Intake"
        title="Emergency Intake"
        description="Captured while the patient is in transit so the receiving team can prepare in parallel."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Patient information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" defaultValue={patientCase.patient.name} />
              <Field label="Age" defaultValue={String(patientCase.patient.age)} />
              <Field label="Sex" defaultValue={patientCase.patient.sex} />
              <Field label="Arrival ETA" defaultValue={patientCase.patient.eta} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Vitals</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Heart Rate (bpm)" defaultValue={String(patientCase.vitals.heartRate)} />
              <Field label="SpO₂ (%)" defaultValue={String(patientCase.vitals.spo2)} />
              <Field label="Blood Pressure" defaultValue={patientCase.vitals.bloodPressure} />
              <Field label="Respiratory Rate" defaultValue={String(patientCase.vitals.respiratoryRate)} />
              <Field label="Temperature (°C)" defaultValue={String(patientCase.vitals.temperature)} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Symptoms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                {SYMPTOMS.map((s) => {
                  const checked = selected.includes(s);
                  return (
                    <label
                      key={s}
                      className={
                        "flex cursor-pointer items-center gap-2 rounded-md border p-3 text-sm transition-colors " +
                        (checked ? "border-primary bg-primary/5" : "hover:bg-muted/50")
                      }
                    >
                      <Checkbox checked={checked} onCheckedChange={() => toggle(s)} />
                      <span>{s}</span>
                    </label>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Free-text emergency scenario</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                rows={5}
                defaultValue={patientCase.freeText}
                placeholder="Patient unconscious after road accident with breathing difficulty…"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Upload evidence (optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <MockUploadDropzone label="Evidence" hint="X-ray, ECG, labs, or notes" />
            </CardContent>
          </Card>
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Ambulance className="h-4 w-4 text-primary" />
                Emergency severity indicator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Current estimate
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <SeverityBadge severity={severity}>{severity}</SeverityBadge>
                  <span className="text-xs text-muted-foreground">
                    {selected.length} symptom{selected.length === 1 ? "" : "s"}
                  </span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  Derived operational severity. Not a clinical diagnosis.
                </p>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={() =>
                  toast.success("Intake submitted", {
                    description: "Receiving team notified. Risk dashboard updated.",
                  })
                }
              >
                <Send className="mr-2 h-4 w-4" />
                Submit intake
              </Button>

              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Mock submission. No data is transmitted in this prototype.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue?: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Input defaultValue={defaultValue} />
    </div>
  );
}
