import { ConsistencyResult, StructureResult, CharacterResult } from "@/lib/api";
import { AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";

interface Props {
  type: "consistency" | "structure" | "character";
  data: ConsistencyResult | StructureResult | CharacterResult;
}

export default function AnalysisPanel({ type, data }: Props) {
  if (type === "consistency") {
    const d = data as ConsistencyResult;
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Consistency Analysis</h3>
          <ScoreBadge score={d.overall_consistency_score} />
        </div>
        <p className="text-sm text-muted-foreground">{d.summary}</p>
        {d.issues.length > 0 && (
          <div className="space-y-2">
            {d.issues.map((issue, i) => (
              <div key={i} className="p-3 rounded-lg bg-muted text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <SeverityDot severity={issue.severity} />
                  <span className="font-medium capitalize">{issue.type}</span>
                </div>
                <p className="text-muted-foreground">{issue.description}</p>
                {issue.excerpt && <p className="italic text-muted-foreground/70">"{issue.excerpt}"</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (type === "structure") {
    const d = data as StructureResult;
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Structure Analysis</h3>
          <div className="flex gap-2">
            <ScoreBadge score={d.structure_score} label="Structure" />
            <ScoreBadge score={d.clarity_score} label="Clarity" />
            <ScoreBadge score={d.flow_score} label="Flow" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{d.overall_feedback}</p>
        {d.strengths.length > 0 && (
          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Strengths</h4>
            {d.strengths.map((s, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-success">
                <CheckCircle className="h-3 w-3 mt-0.5 shrink-0" />
                {s}
              </div>
            ))}
          </div>
        )}
        {d.suggestions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Suggestions</h4>
            {d.suggestions.map((s, i) => (
              <div key={i} className="p-3 rounded-lg bg-muted text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <SeverityDot severity={s.priority} />
                  <span className="font-medium capitalize">{s.category}</span>
                </div>
                <p className="text-muted-foreground">{s.issue}</p>
                <p className="text-foreground">{s.suggestion}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (type === "character") {
    const d = data as CharacterResult;
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{d.character}'s Evolution</h3>
          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{d.arc_type}</span>
        </div>
        <p className="text-sm text-muted-foreground">{d.overall_development}</p>
        <div className="space-y-3">
          {d.evolution_stages.map((stage, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">
                  {stage.stage}
                </div>
                {i < d.evolution_stages.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
              </div>
              <div className="pb-4 text-xs space-y-1">
                <p className="font-medium">{stage.label}</p>
                <p className="text-muted-foreground">Emotion: {stage.emotional_state} · Trait: {stage.key_trait}</p>
                <p className="text-muted-foreground italic">Trigger: {stage.trigger}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

function ScoreBadge({ score, label }: { score: number; label?: string }) {
  const color = score >= 75 ? "text-success" : score >= 50 ? "text-primary" : "text-destructive";
  return (
    <span className={`text-xs font-mono font-bold ${color}`}>
      {label ? `${label}: ` : ""}{score}
    </span>
  );
}

function SeverityDot({ severity }: { severity: string }) {
  const color = severity === "high" ? "bg-destructive" : severity === "medium" ? "bg-primary" : "bg-muted-foreground";
  return <div className={`w-2 h-2 rounded-full ${color}`} />;
}
