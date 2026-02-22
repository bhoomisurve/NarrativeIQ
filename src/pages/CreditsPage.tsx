import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Coins, Sparkles, Zap, Crown, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CREDIT_PACKS = [
  { amount: 10, label: "Starter", price: "Free", icon: Sparkles, description: "Get started with basic features", highlight: false },
  { amount: 50, label: "Writer", price: "$4.99", icon: Zap, description: "Perfect for short stories & essays", highlight: true },
  { amount: 200, label: "Author", price: "$14.99", icon: Crown, description: "Full novels & deep analysis", highlight: false },
];

export default function CreditsPage() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<number | null>(null);

  const handleBuyCredits = async (amount: number, index: number) => {
    setLoading(index);
    try {
      const res = await api.addCredits(amount);
      await refreshUser();
      toast.success(`Added ${amount} credits! New balance: ${res.new_balance}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to add credits");
    } finally {
      setLoading(null);
    }
  };

  const isOutOfCredits = (user?.credits ?? 0) === 0;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        {isOutOfCredits ? (
          <>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive text-sm font-medium mb-4"
            >
              <Coins className="h-4 w-4" />
              You're out of credits!
            </motion.div>
            <h1 className="text-3xl font-display font-bold">Top Up Your Credits</h1>
            <p className="text-muted-foreground">Purchase credits to continue using NarrativeIQ's AI features.</p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-display font-bold">Credits</h1>
            <p className="text-muted-foreground">Your current balance and purchase options.</p>
          </>
        )}
      </div>

      {/* Current balance */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-3 p-6 rounded-xl border border-border bg-card glow-gold"
      >
        <Coins className="h-8 w-8 text-primary" />
        <div>
          <p className="text-3xl font-bold text-gradient-gold">{user?.credits ?? 0}</p>
          <p className="text-xs text-muted-foreground">credits remaining</p>
        </div>
      </motion.div>

      {/* Credit packs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CREDIT_PACKS.map((pack, i) => (
          <motion.div
            key={pack.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative p-6 rounded-xl border text-center space-y-4 transition-all hover:scale-[1.02] ${
              pack.highlight
                ? "border-primary/40 bg-primary/5 glow-gold"
                : "border-border bg-card"
            }`}
          >
            {pack.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider">
                Popular
              </span>
            )}
            <pack.icon className={`h-8 w-8 mx-auto ${pack.highlight ? "text-primary" : "text-muted-foreground"}`} />
            <div>
              <h3 className="font-display font-bold text-lg">{pack.label}</h3>
              <p className="text-xs text-muted-foreground">{pack.description}</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{pack.amount}</p>
              <p className="text-xs text-muted-foreground">credits</p>
            </div>
            <p className="text-sm font-semibold text-primary">{pack.price}</p>
            <Button
              onClick={() => handleBuyCredits(pack.amount, i)}
              disabled={loading !== null}
              variant={pack.highlight ? "default" : "outline"}
              className="w-full"
            >
              {loading === i ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>Get Credits</>
              )}
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Pricing info */}
      <div className="text-center space-y-2">
        <p className="text-xs text-muted-foreground">
          Each enhancement or analysis costs 1-2 credits. Deep scans cost 2 credits.
        </p>
        {isOutOfCredits && (
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="text-muted-foreground">
            Back to Workspace <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}
