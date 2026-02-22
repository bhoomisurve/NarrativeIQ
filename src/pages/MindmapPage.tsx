import { useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Brain, Upload, Download, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export default function MindmapPage() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [title, setTitle] = useState("Narrative Mindmap");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await api.uploadFile(file);
      setText(res.text);
      setTitle(file.name.replace(/\.[^.]+$/, ""));
      toast.success(`Extracted ${res.word_count} words`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    }
  };

  const handleGenerate = async () => {
    if (!text.trim()) return toast.error("Enter some text first");
    if (text.length < 100) return toast.error("Text must be at least 100 characters");
    if ((user?.credits ?? 0) < 2) {
      navigate("/credits");
      return toast.error("You need at least 2 credits!");
    }

    setLoading(true);
    setImageUrl(null);

    try {
      const blob = await api.generateMindmapImage(text, title);
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
      refreshUser();
      toast.success("Mindmap generated! (2 credits used)");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Mindmap generation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = `${title.replace(/\s+/g, "_")}_mindmap.png`;
    a.click();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          Narrative Memory Graph
        </h1>
        <p className="text-sm text-muted-foreground">
          Paste your narrative to generate a visual mindmap of characters, locations, themes & relationships.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Input
              placeholder="Mindmap title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-muted border-border flex-1"
            />
            <label className="cursor-pointer">
              <input type="file" accept=".pdf,.txt,.md" className="hidden" onChange={handleFileUpload} />
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-muted text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors">
                <Upload className="h-4 w-4" />
                Upload
              </div>
            </label>
          </div>
          <Textarea
            placeholder="Paste your story, script, or narrative here (min 100 characters)…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[350px] bg-muted border-border font-mono text-sm resize-none"
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {text.split(/\s+/).filter(Boolean).length} words · {text.length} characters
            </p>
            <span className="text-xs text-muted-foreground">Cost: 2 credits</span>
          </div>
          <Button onClick={handleGenerate} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Mindmap…
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Generate Mindmap (2 credits)
              </>
            )}
          </Button>
        </div>

        {/* Output */}
        <div className="space-y-3">
          <div className="border border-border rounded-xl bg-card overflow-hidden min-h-[400px] flex items-center justify-center">
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-3 p-8"
              >
                <Loader2 className="h-10 w-10 mx-auto animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Analyzing narrative & building graph…</p>
                <p className="text-xs text-muted-foreground">This may take 15-30 seconds</p>
              </motion.div>
            )}

            {!loading && imageUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full"
              >
                <img
                  src={imageUrl}
                  alt="Narrative Mindmap"
                  className="w-full h-auto rounded-lg"
                />
              </motion.div>
            )}

            {!loading && !imageUrl && (
              <div className="text-center text-muted-foreground p-8 space-y-2">
                <Sparkles className="h-10 w-10 mx-auto opacity-30" />
                <p className="text-sm">Your narrative mindmap will appear here</p>
                <p className="text-xs opacity-60">Characters · Locations · Themes · Relationships</p>
              </div>
            )}
          </div>

          {imageUrl && !loading && (
            <Button variant="outline" onClick={handleDownload} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Mindmap PNG
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
