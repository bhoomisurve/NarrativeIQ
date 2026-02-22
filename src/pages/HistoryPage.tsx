import { useState, useEffect } from "react";
import { api, HistoryEntry } from "@/lib/api";
import { toast } from "sonner";
import { History, Coins } from "lucide-react";

const OP_LABELS: Record<string, string> = {
  persona_enhance: "Persona Enhancement",
  consistency_check: "Consistency Check",
  structure_check: "Structure Analysis",
  character_evolution: "Character Evolution",
  deep_scan: "Deep Scan",
  mindmap_generate: "Mindmap",
  mindmap_image: "Mindmap Image",
  story_complete: "Story Completion",
};

export default function HistoryPage() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getHistory().then((res) => setEntries(res.history)).catch(() => toast.error("Failed to load history")).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-center text-muted-foreground">Loading…</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-display font-bold">History</h1>

      {entries.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <History className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No activity yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => (
            <div key={entry._id} className="p-4 rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{OP_LABELS[entry.operation] || entry.operation}</span>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Coins className="h-3 w-3" />{entry.credits_used}</span>
                  <span>{entry.created_at && new Date(entry.created_at).toLocaleString()}</span>
                </div>
              </div>
              {entry.persona && <span className="text-xs text-primary capitalize">{entry.persona}</span>}
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{entry.input_text?.slice(0, 200)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
