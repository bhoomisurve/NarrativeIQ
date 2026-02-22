import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Feather, Wand2, Search, BookOpen, Users, Zap, Network, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Wand2, title: "Persona Enhancement", desc: "Rewrite in 6 distinct voices — technical, business, poetic, and more." },
  { icon: Search, title: "Consistency Analysis", desc: "Detect plot holes, timeline issues, and character contradictions." },
  { icon: BookOpen, title: "Story Completion", desc: "Start with an idea, get a full narrative with structure." },
  { icon: Users, title: "Character Tracking", desc: "Map emotional arcs and behavioral evolution." },
  { icon: Zap, title: "Deep Scan", desc: "Combined consistency + structure analysis in one sweep." },
  {
    icon: Network,
    title: "Narrative Mindmap",
    desc: "Extract characters, locations, themes & relationships — visualized as an interactive, downloadable knowledge graph.",
    badge: "New",
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Feather className="h-6 w-6 text-primary" />
            <span className="text-lg font-display font-bold text-gradient-gold">NarrativeIQ</span>
          </div>
          <Link to="/auth">
            <Button size="sm">Get Started <ArrowRight className="h-4 w-4 ml-1" /></Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-5xl md:text-6xl font-display font-bold leading-tight mb-6">
              Your narrative,{" "}
              <span className="text-gradient-gold">elevated</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              AI-powered writing intelligence. Enhance scripts, analyze consistency, track characters, and complete stories — all in one workspace.
            </p>
            <Link to="/auth">
              <Button size="lg" className="text-base px-8">
                Start Writing <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.4 }}
                className="relative p-6 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors"
              >
                {f.badge && (
                  <span className="absolute top-4 right-4 text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30">
                    {f.badge}
                  </span>
                )}
                <f.icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6 text-center text-sm text-muted-foreground">
        NarrativeIQ - Craft better stories with AI
      </footer>
    </div>
  );
}