import React, { useState, useEffect, useCallback } from 'react';
import Markdown from 'react-markdown';
import { X, ShieldCheck, FileText, AlertOctagon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDoc?: 'terms' | 'privacy' | 'disclaimer';
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, initialDoc = 'terms' }) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'disclaimer'>(initialDoc);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const loadDoc = useCallback(async (doc: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/legal/${doc}.md`);
      const text = await response.text();
      setContent(text);
    } catch {
      setContent('Failed to load document.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      void loadDoc(activeTab);
    }
  }, [isOpen, activeTab, loadDoc]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <h2 className="text-xl font-bold text-white uppercase font-mono tracking-tight">Legal & Compliance</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar Tabs */}
              <div className="w-64 border-r border-slate-800 bg-slate-950/30 p-4 space-y-2 hidden md:block">
                {[
                  { id: 'terms', label: 'Terms of Service', icon: FileText },
                  { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck },
                  { id: 'disclaimer', label: 'Risk Disclaimer', icon: AlertOctagon },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium transition-all ${
                      activeTab === tab.id 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-8 bg-slate-900 custom-scrollbar">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <div className="prose prose-invert prose-slate max-w-none prose-headings:font-mono prose-headings:uppercase prose-headings:tracking-wider prose-p:text-slate-400 prose-p:leading-relaxed">
                    <Markdown>{content}</Markdown>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500 uppercase">
                © 2026 ALLMONEYIN33 LLC // GHOSTCHAIN SAFEFI COMPLIANCE
              </span>
              <button 
                onClick={onClose}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-lg transition-colors border border-slate-700"
              >
                DISMISS
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
