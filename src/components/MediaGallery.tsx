import React, { useState, useEffect } from 'react';
import { Play, Film, Calendar, Trash2, Shield, Rocket } from 'lucide-react';
import { Card, Badge, Button } from './ui/core';
import { motion } from 'motion/react';

interface VideoFile {
  name: string;
  url: string;
  timestamp: string;
}

export function MediaGallery() {
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVideos = async () => {
    try {
      const res = await fetch('/api/vaults/videos');
      const data = await res.json();
      setVideos(data.sort((a: VideoFile, b: VideoFile) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    } catch (err) {
      console.error("Gallery sync failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchVideos();
  }, []); // Initial load only

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
               <Film size={20} />
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Vault <span className="text-blue-500 font-sans not-italic">Showcase</span></h3>
         </div>
         <Button onClick={fetchVideos} variant="ghost" className="text-[10px] text-slate-500 uppercase tracking-widest">Refresh Feed</Button>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center border border-white/5 bg-black/20 rounded-3xl">
           <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.5em] animate-pulse">Syncing Medias...</p>
        </div>
      ) : videos.length === 0 ? (
        <Card className="bg-[#050505] border-white/5 p-12 text-center">
           <Shield className="w-12 h-12 text-slate-800 mx-auto mb-4" />
           <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-relaxed"> No verified contest submissions found in the Sovereign Shard. <br/> Start the Presentation Engine to record your first demo. </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {videos.map((v, i) => (
             <motion.div
               key={v.name}
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: i * 0.1 }}
             >
               <Card className="p-0 overflow-hidden bg-black/60 border-white/5 group hover:border-blue-500/30 transition-all">
                  <div className="aspect-video bg-slate-900 flex items-center justify-center relative">
                     <video 
                        src={v.url} 
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                        onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                        onMouseLeave={(e) => {
                          const v = e.target as HTMLVideoElement;
                          v.pause();
                          v.currentTime = 0;
                        }}
                        muted
                     />
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="p-4 bg-blue-500 text-white rounded-full scale-75 group-hover:scale-100 transition-transform">
                           <Play fill="currentColor" />
                        </div>
                     </div>
                  </div>
                  <div className="p-4 space-y-3">
                     <div className="flex justify-between items-start">
                        <p className="text-[10px] font-black text-white uppercase truncate pr-4">{v.name.replace('.mp4', '')}</p>
                        <Badge variant="outline" className="text-[8px] scale-75 origin-right">VERIFIED</Badge>
                     </div>
                     <div className="flex items-center gap-2 text-slate-500">
                        <Calendar size={10} />
                        <span className="text-[9px] font-mono">{new Date(v.timestamp).toLocaleDateString()}</span>
                     </div>
                     <div className="flex gap-2 pt-2">
                        <Button className="flex-1 bg-white/5 border border-white/10 text-white py-2 text-[9px] font-black uppercase tracking-widest hover:bg-white/10" onClick={() => window.open(v.url, '_blank')}>View Full</Button>
                        <Button variant="ghost" className="text-rose-500 px-3"><Trash2 size={14} /></Button>
                     </div>
                  </div>
               </Card>
             </motion.div>
           ))}
        </div>
      )}
    </div>
  );
}
