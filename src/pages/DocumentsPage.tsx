import { useState, useEffect } from "react";
import { api, Document } from "@/lib/api";
import { toast } from "sonner";
import { FileText, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  useEffect(() => {
    api.getDocuments().then((res) => setDocs(res.documents)).catch(() => toast.error("Failed to load documents")).finally(() => setLoading(false));
  }, []);

  const viewDoc = async (id: string) => {
    try {
      const doc = await api.getDocument(id);
      setSelectedDoc(doc);
    } catch {
      toast.error("Failed to load document");
    }
  };

  if (loading) return <div className="p-6 text-center text-muted-foreground">Loading…</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-display font-bold">Documents</h1>

      {selectedDoc ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <button onClick={() => setSelectedDoc(null)} className="text-sm text-primary hover:underline">← Back to list</button>
          <div className="border border-border rounded-xl bg-card p-6">
            <h2 className="text-lg font-display font-bold mb-2">{selectedDoc.title}</h2>
            <p className="text-xs text-muted-foreground mb-4">{selectedDoc.created_at && new Date(selectedDoc.created_at).toLocaleDateString()}</p>
            <div className="whitespace-pre-wrap text-sm leading-relaxed font-mono">{selectedDoc.content}</div>
          </div>
        </motion.div>
      ) : docs.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No documents yet. Enhance some text to get started.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {docs.map((doc) => (
            <button
              key={doc._id}
              onClick={() => viewDoc(doc._id)}
              className="text-left p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-sm">{doc.title}</h3>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {doc.created_at && new Date(doc.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">{doc.preview}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
