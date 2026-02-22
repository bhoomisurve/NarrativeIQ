import { useState } from "react";
import { api, StoryResult } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { BookOpen, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const GENRES = ["general", "fantasy", "sci-fi", "romance", "thriller", "horror", "comedy", "drama"];
const STYLES = ["narrative", "screenplay", "first-person", "third-person"];
const LENGTHS = ["short", "medium", "long"];

export default function StoryPage() {
  const { refreshUser } = useAuth();
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("general");
  const [style, setStyle] = useState("narrative");
  const [length, setLength] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StoryResult | null>(null);

  const handleComplete = async () => {
    if (text.trim().length < 20) return toast.error("Write at least a sentence to start");
    setLoading(true);
    try {
      const res = await api.completeStory(text, genre, style, length, title || "My Story");
      setResult(res);
      refreshUser();
      toast.success("Story completed!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Story completion failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Story Completion</h1>
        <p className="text-sm text-muted-foreground">Start a story idea, and AI will complete it into a full narrative.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          <Input placeholder="Story title" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-muted border-border" />
          <Textarea
            placeholder="Start your story here… (at least one sentence)"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[300px] bg-muted border-border font-mono text-sm resize-none"
          />
        </div>

        <div className="space-y-4">
          <OptionGroup label="Genre" options={GENRES} value={genre} onChange={setGenre} />
          <OptionGroup label="Style" options={STYLES} value={style} onChange={setStyle} />
          <OptionGroup label="Length" options={LENGTHS} value={length} onChange={setLength} />
          <Button onClick={handleComplete} disabled={loading} className="w-full">
            <BookOpen className="h-4 w-4 mr-2" />
            {loading ? "Completing…" : "Complete Story (2 credits)"}
          </Button>
        </div>
      </div>

      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="border border-border rounded-xl bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold">{result.title}</h2>
            <span className="text-xs text-muted-foreground">{result.word_count} words · {result.genre_detected}</span>
          </div>
          <p className="text-sm text-muted-foreground italic">{result.summary}</p>

          {result.story_structure && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {Object.entries(result.story_structure).map(([key, val]) => (
                <div key={key} className="p-3 rounded-lg bg-muted text-xs">
                  <span className="font-semibold capitalize block mb-1">{key}</span>
                  <span className="text-muted-foreground">{val}</span>
                </div>
              ))}
            </div>
          )}

          <div className="prose prose-invert max-w-none text-sm whitespace-pre-wrap leading-relaxed">
            {result.completed_story}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function OptionGroup({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
              value === opt ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
