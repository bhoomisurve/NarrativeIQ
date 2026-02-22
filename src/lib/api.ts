const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
    if (token) localStorage.setItem("niq_token", token);
    else localStorage.removeItem("niq_token");
  }

  getToken(): string | null {
    if (!this.token) this.token = localStorage.getItem("niq_token");
    return this.token;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.getToken()) {
      headers["Authorization"] = `Bearer ${this.getToken()}`;
    }

    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || `Request failed (${res.status})`);
    }

    return data as T;
  }

  // Auth
  register(name: string, email: string, password: string) {
    return this.request<{ token: string; user: User }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  }

  login(email: string, password: string) {
    return this.request<{ token: string; user: User }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  me() {
    return this.request<User>("/api/auth/me");
  }

  // Credits
  getCredits() {
    return this.request<{ credits: number }>("/api/credits/balance");
  }

  getPricing() {
    return this.request<{ features: Record<string, { cost: number; label: string }> }>("/api/credits/pricing");
  }

  addCredits(amount: number) {
    return this.request<{ message: string; new_balance: number }>("/api/credits/add", {
      method: "POST",
      body: JSON.stringify({ amount }),
    });
  }

  // Profile
  updateProfile(data: { name?: string; email?: string }) {
    return this.request<{ message: string; user: User }>("/api/auth/update-profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  changePassword(current_password: string, new_password: string) {
    return this.request<{ message: string }>("/api/auth/change-password", {
      method: "PUT",
      body: JSON.stringify({ current_password, new_password }),
    });
  }

  // Personas
  getPersonas() {
    return this.request<Record<string, { label: string; description: string }>>("/api/enhance/personas");
  }

  // Enhance
  enhanceWithPersona(text: string, persona: string, title?: string, doc_id?: string) {
    return this.request<EnhanceResult>("/api/enhance/persona", {
      method: "POST",
      body: JSON.stringify({ text, persona, title, doc_id }),
    });
  }

  // Analyze
  analyzeConsistency(text: string, doc_id?: string) {
    return this.request<{ consistency_analysis: ConsistencyResult; credits_used: number }>("/api/analyze/consistency", {
      method: "POST",
      body: JSON.stringify({ text, doc_id }),
    });
  }

  analyzeStructure(text: string, doc_id?: string) {
    return this.request<{ structure_analysis: StructureResult; credits_used: number }>("/api/analyze/structure", {
      method: "POST",
      body: JSON.stringify({ text, doc_id }),
    });
  }

  analyzeCharacter(text: string, character_name: string, doc_id?: string) {
    return this.request<{ character_evolution: CharacterResult; credits_used: number }>("/api/analyze/character", {
      method: "POST",
      body: JSON.stringify({ text, character_name, doc_id }),
    });
  }

  deepScan(text: string, doc_id?: string) {
    return this.request<{ deep_scan: DeepScanResult; credits_used: number }>("/api/analyze/deep-scan", {
      method: "POST",
      body: JSON.stringify({ text, doc_id }),
    });
  }

  // Mindmap
  generateMindmap(text: string, doc_id?: string) {
    return this.request<{ mindmap: MindmapResult; credits_used: number }>("/api/mindmap/generate", {
      method: "POST",
      body: JSON.stringify({ text, doc_id }),
    });
  }

  async generateMindmapImage(text: string, title?: string, doc_id?: string): Promise<Blob> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (this.getToken()) headers["Authorization"] = `Bearer ${this.getToken()}`;
    const res = await fetch(`${API_BASE}/api/mindmap/image`, {
      method: "POST",
      headers,
      body: JSON.stringify({ text, title, doc_id }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: "Request failed" }));
      throw new Error(data.error || `Request failed (${res.status})`);
    }
    return res.blob();
  }

  // Story
  completeStory(text: string, genre?: string, style?: string, length?: string, title?: string) {
    return this.request<StoryResult>("/api/story/complete", {
      method: "POST",
      body: JSON.stringify({ text, genre, style, length, title }),
    });
  }

  // Documents
  getDocuments() {
    return this.request<{ documents: Document[] }>("/api/enhance/documents");
  }

  getDocument(docId: string) {
    return this.request<Document>(`/api/enhance/documents/${docId}`);
  }

  saveDocument(title: string, content: string) {
    return this.request<{ doc_id: string }>("/api/enhance/save", {
      method: "POST",
      body: JSON.stringify({ title, content }),
    });
  }

  // History
  getHistory() {
    return this.request<{ history: HistoryEntry[] }>("/api/enhance/history");
  }

  // Upload
  uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return this.request<{ text: string; word_count: number; char_count: number; filename: string }>("/api/upload/extract", {
      method: "POST",
      body: formData,
    });
  }
}

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  credits: number;
}

export interface EnhanceResult {
  enhanced_text: string;
  changes: { original: string; enhanced: string; reason: string }[];
  diff: { type: "equal" | "insert" | "delete"; text: string }[];
  similarity_score: number;
  persona: string;
  doc_id: string;
  credits_used: number;
}

export interface ConsistencyResult {
  issues: { type: string; description: string; excerpt: string; severity: string }[];
  overall_consistency_score: number;
  summary: string;
}

export interface StructureResult {
  structure_score: number;
  clarity_score: number;
  flow_score: number;
  suggestions: { category: string; issue: string; suggestion: string; priority: string }[];
  strengths: string[];
  overall_feedback: string;
}

export interface CharacterResult {
  character: string;
  evolution_stages: { stage: number; label: string; emotional_state: string; key_trait: string; trigger: string; excerpt: string }[];
  arc_type: string;
  overall_development: string;
}

export interface DeepScanResult {
  consistency: ConsistencyResult;
  structure: StructureResult;
  combined_score: number;
}

export interface MindmapResult {
  nodes: { id: string; data: { label: string; type: string }; type: string; position: { x: number; y: number } }[];
  edges: { id: string; source: string; target: string; label: string }[];
  entities: Record<string, unknown>;
  relationships: { from: string; to: string; type: string; description: string }[];
  summary: { character_count: number; location_count: number; theme_count: number; relationship_count: number };
}

export interface StoryResult {
  completed_story: string;
  title: string;
  summary: string;
  characters: string[];
  genre_detected: string;
  word_count: number;
  story_structure: { setup: string; conflict: string; climax: string; resolution: string };
  doc_id: string;
  credits_used: number;
}

export interface Document {
  _id: string;
  user_id: string;
  title: string;
  content?: string;
  preview?: string;
  created_at: string;
  updated_at?: string;
}

export interface HistoryEntry {
  _id: string;
  operation: string;
  persona: string | null;
  input_text: string;
  output_text: string;
  credits_used: number;
  created_at: string;
}

export const api = new ApiClient();
