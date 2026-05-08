import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, Scroll, Shield, Zap, Sparkles, ChevronRight, Binary, Globe } from 'lucide-react';
import { cn } from '../lib/utils';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface LoreEntry {
  title: string;
  body: string;
  category: 'Genesis' | 'Totality' | 'Nexus' | 'Sovereignty';
}

export function SovereignCodex() {
  const [entries, setEntries] = useState<LoreEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Genesis', 'Totality', 'Nexus', 'Sovereignty'];

  useEffect(() => {
    async function fetchLore() {
      if (!process.env.GEMINI_API_KEY) return;
      
      try {
        const model = ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `
              You are the Chronicler of the GhostChain Genesis. 
              Generate 5 distinct ontological entries for the Sovereign Codex. 
              Each entry should have a title, a short lore-heavy body, and a category.
              Categories must be one of: [Genesis, Totality, Nexus, Sovereignty].
              
              Output ONLY a JSON array of objects: 
              [{"title": "...", "body": "...", "category": "..."}]
            `,
            config: {
                responseMimeType: "application/json"
            }
        });

        const res = await model;
        const data = JSON.parse(res.text || "[]");
        setEntries(data);
      } catch (err) {
        console.error("Failed to fetch lore:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLore();
  }, []);

  const filteredEntries = selectedCategory === 'All' 
    ? entries 
    : entries.filter(e => e.category === selectedCategory);

  return (
    <div className="h-full bg-black/90 p-12 flex flex-col gap-12 overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full space-y-12">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="p-4 bg-red-600/10 rounded-full border border-red-600/20">
            <Book className="w-10 h-10 text-red-500" />
          </div>
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-white tracking-[0.25em] uppercase italic">Sovereign <span className="text-red-500">Codex</span></h2>
            <p className="text-slate-500 font-mono text-sm">The ontological record of the GhostChain Genesis.</p>
          </div>
        </div>

        <div className="flex justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                selectedCategory === cat 
                  ? "bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)]" 
                  : "bg-white/5 text-slate-500 hover:bg-white/10 hover:text-white"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-64 bg-white/5 rounded-3xl animate-pulse border border-white/5" />
            ))
          ) : (
            filteredEntries.map((entry, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={i}
                className="group relative bg-slate-900/40 border border-white/5 rounded-3xl p-8 hover:border-red-500/30 transition-all overflow-hidden"
              >
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                   {entry.category === 'Genesis' && <Sparkles className="w-48 h-48 text-white" />}
                   {entry.category === 'Totality' && <Globe className="w-48 h-48 text-white" />}
                   {entry.category === 'Nexus' && <Binary className="w-48 h-48 text-white" />}
                   {entry.category === 'Sovereignty' && <Shield className="w-48 h-48 text-white" />}
                </div>

                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-red-600/10 rounded-full text-[9px] font-black uppercase text-red-500 tracking-tighter border border-red-500/20">
                      {entry.category}
                    </span>
                    <Scroll className="w-5 h-5 text-slate-700" />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-black text-white uppercase italic group-hover:text-red-500 transition-colors">
                      {entry.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed font-serif italic">
                      "{entry.body}"
                    </p>
                  </div>

                  <div className="pt-4 flex items-center gap-2 text-slate-600 group-hover:text-red-400 transition-colors">
                    <Zap className="w-4 h-4 fill-current" />
                    <span className="text-[10px] uppercase font-black tracking-widest cursor-pointer">Attune Resonance</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {!isLoading && filteredEntries.length === 0 && (
          <div className="text-center py-24 opacity-20 italic">
            No chronicles archived in this dimension.
          </div>
        )}
      </div>
    </div>
  );
}
