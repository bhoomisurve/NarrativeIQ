import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api, EnhanceResult, ConsistencyResult, StructureResult, CharacterResult, StoryResult } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Sparkles, Upload, Wand2, Search, Users, BookOpen, Zap, FileText, Cpu, Briefcase, BarChart2, Feather, Smile, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import DiffView from "@/components/DiffView";
import AnalysisPanel from "@/components/AnalysisPanel";

const PERSONAS = [
  { key: "technical", label: "Technical", icon: Cpu },
  { key: "business", label: "Business", icon: Briefcase },
  { key: "finance", label: "Finance", icon: BarChart2 },
  { key: "simplified", label: "Simplified", icon: PenLine },
  { key: "comedian", label: "Comedian", icon: Smile },
  { key: "poet", label: "Poet", icon: Feather },
];

type Tab = "enhance" | "consistency" | "structure" | "character" | "deep-scan";

export default function Dashboard() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [selectedPersona, setSelectedPersona] = useState("simplified");
  const [activeTab, setActiveTab] = useState<Tab>("enhance");
  const [loading, setLoading] = useState(false);
  const [characterName, setCharacterName] = useState("");

  // Results
  const [enhanceResult, setEnhanceResult] = useState<EnhanceResult | null>(null);
  const [consistencyResult, setConsistencyResult] = useState<ConsistencyResult | null>(null);
  const [structureResult, setStructureResult] = useState<StructureResult | null>(null);
  const [characterResult, setCharacterResult] = useState<CharacterResult | null>(null);

  const checkCredits = () => {
    if ((user?.credits ?? 0) <= 0) {
      navigate("/credits");
      toast.error("You're out of credits!");
      return false;
    }
    return true;
  };

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

  const handleEnhance = async () => {
    if (!text.trim()) return toast.error("Enter some text first");
    if (!checkCredits()) return;
    setLoading(true);
    try {
      const res = await api.enhanceWithPersona(text, selectedPersona, title || "Untitled");
      setEnhanceResult(res);
      refreshUser();
      toast.success(`Enhanced with ${res.persona} persona`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Enhancement failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalysis = async (type: Tab) => {
    if (!text.trim()) return toast.error("Enter some text first");
    if (type === "character" && !characterName.trim()) return toast.error("Enter a character name");
    if (!checkCredits()) return;
    setLoading(true);
    try {
      if (type === "consistency") {
        const res = await api.analyzeConsistency(text);
        setConsistencyResult(res.consistency_analysis);
      } else if (type === "structure") {
        const res = await api.analyzeStructure(text);
        setStructureResult(res.structure_analysis);
      } else if (type === "character") {
        const res = await api.analyzeCharacter(text, characterName);
        setCharacterResult(res.character_evolution);
      } else if (type === "deep-scan") {
        const res = await api.deepScan(text);
        setConsistencyResult(res.deep_scan.consistency);
        setStructureResult(res.deep_scan.structure);
      }
      refreshUser();
      toast.success("Analysis complete");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { key: "enhance" as Tab, label: "Enhance", icon: Wand2, cost: 1 },
    { key: "consistency" as Tab, label: "Consistency", icon: Search, cost: 1 },
    { key: "structure" as Tab, label: "Structure", icon: FileText, cost: 1 },
    { key: "character" as Tab, label: "Character", icon: Users, cost: 1 },
    { key: "deep-scan" as Tab, label: "Deep Scan", icon: Zap, cost: 2 },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Workspace</h1>
        <p className="text-sm text-muted-foreground">Paste or upload your narrative, then enhance and analyze.</p>
      </div>

      {/* Text input area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Input
              placeholder="Document title"
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
            placeholder="Paste your story, script, or narrative here…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[400px] bg-muted border-border font-mono text-sm resize-none"
          />
          <p className="text-xs text-muted-foreground">{text.split(/\s+/).filter(Boolean).length} words · {text.length} characters</p>
        </div>

        {/* Right panel: tabs & actions */}
        <div className="space-y-4">
          {/* Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="h-3 w-3" />
                {tab.label}
                <span className="opacity-60">({tab.cost})</span>
              </button>
            ))}
          </div>

          {/* Enhance tab */}
          {activeTab === "enhance" && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Select Persona</p>
                <div className="grid grid-cols-3 gap-2">
                  {PERSONAS.map((p) => (
                    <button
                      key={p.key}
                      onClick={() => setSelectedPersona(p.key)}
                      className={`p-3 rounded-lg border text-center text-sm transition-all ${
                        selectedPersona === p.key
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border bg-muted text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      <p.icon className={`h-5 w-5 mx-auto mb-1.5 ${selectedPersona === p.key ? "text-primary" : "text-muted-foreground"}`} />
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={handleEnhance} disabled={loading} className="w-full">
                <Wand2 className="h-4 w-4 mr-2" />
                {loading ? "Enhancing…" : "Enhance Text (1 credit)"}
              </Button>
            </div>
          )}

          {/* Character tab */}
          {activeTab === "character" && (
            <div className="space-y-3">
              <Input
                placeholder="Character name to track"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                className="bg-muted border-border"
              />
              <Button onClick={() => handleAnalysis("character")} disabled={loading} className="w-full">
                <Users className="h-4 w-4 mr-2" />
                {loading ? "Analyzing…" : "Track Character (1 credit)"}
              </Button>
            </div>
          )}

          {/* Other analysis tabs */}
          {(activeTab === "consistency" || activeTab === "structure" || activeTab === "deep-scan") && (
            <Button onClick={() => handleAnalysis(activeTab)} disabled={loading} className="w-full">
              {activeTab === "deep-scan" ? <Zap className="h-4 w-4 mr-2" /> : <Search className="h-4 w-4 mr-2" />}
              {loading ? "Analyzing…" : `Run ${tabs.find(t => t.key === activeTab)?.label} (${tabs.find(t => t.key === activeTab)?.cost} credit${activeTab === "deep-scan" ? "s" : ""})`}
            </Button>
          )}

          {/* Results */}
          <div className="border border-border rounded-xl bg-card overflow-hidden max-h-[500px] overflow-y-auto">
            {enhanceResult && activeTab === "enhance" && (
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Enhanced with {enhanceResult.persona}</h3>
                  <span className="text-xs text-muted-foreground">{enhanceResult.similarity_score}% similar</span>
                </div>
                <DiffView diff={enhanceResult.diff} />
                {enhanceResult.changes.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Key Changes</h4>
                    {enhanceResult.changes.map((c, i) => (
                      <div key={i} className="p-3 rounded-lg bg-muted text-xs space-y-1">
                        <div><span className="line-through text-destructive">{c.original}</span></div>
                        <div><span className="text-success">{c.enhanced}</span></div>
                        <div className="text-muted-foreground italic">{c.reason}</div>
                      </div>
                    ))}
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setText(enhanceResult.enhanced_text);
                    toast.success("Applied enhanced text");
                  }}
                >
                  Apply Enhanced Text
                </Button>
              </div>
            )}

            {(activeTab === "consistency" || activeTab === "deep-scan") && consistencyResult && (
              <AnalysisPanel type="consistency" data={consistencyResult} />
            )}
            {(activeTab === "structure" || activeTab === "deep-scan") && structureResult && (
              <AnalysisPanel type="structure" data={structureResult} />
            )}
            {activeTab === "character" && characterResult && (
              <AnalysisPanel type="character" data={characterResult} />
            )}

            {!enhanceResult && activeTab === "enhance" && !loading && (
              <div className="p-8 text-center text-muted-foreground text-sm">
                <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-30" />
                Results will appear here
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}