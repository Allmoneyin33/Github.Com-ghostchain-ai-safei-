import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Download, 
  Video, 
  Mic, 
  Monitor, 
  AlertCircle,
  CheckCircle,
  Loader2,
  X,
  Rocket
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PRESENTATION_SCRIPT } from '../constants/presentation';
import { Button, Card, Badge } from './ui/core';
import { apiService } from '../services/api';

export function PresentationEngine({ onClose }: { onClose: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [status, setStatus] = useState<'idle' | 'recording' | 'finished'>('idle');
  
  const videoRef = useRef<HTMLDivElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const currentSegment = PRESENTATION_SCRIPT.find((s, i) => {
    const next = PRESENTATION_SCRIPT[i + 1];
    return currentTime >= s.time && (!next || currentTime < next.time);
  });

  const playAiVoice = async (text: string) => {
    try {
      const blob = await apiService.speak(text);
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
    } catch (err) {
      console.warn("High-fidelity TTS failed, falling back to local synthesis:", err);
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.95;
      utter.pitch = 0.9;
      window.speechSynthesis.speak(utter);
    }
  };

  const startPresentation = async () => {
    setIsPlaying(true);
    setStatus('recording');
    setCurrentTime(0);

    // Initial audio trigger
    if (PRESENTATION_SCRIPT[0]) {
      playAiVoice(PRESENTATION_SCRIPT[0].text);
    }
    
    // Start Recording logic
    if (videoRef.current) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: { frameRate: 60 },
          audio: true
        });

        recorderRef.current = new MediaRecorder(stream, {
          mimeType: 'video/webm;codecs=vp9'
        });

        recorderRef.current.ondataavailable = (e) => {
          if (e.data.size > 0) setRecordedChunks(prev => [...prev, e.data]);
        };

        recorderRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Recording failed:", err);
      }
    }

    timerRef.current = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= 180) {
          stopPresentation();
          return 180;
        }
        
        // Trigger voice if segment changed
        const seg = PRESENTATION_SCRIPT.find(s => s.time === prev + 1);
        if (seg) {
          playAiVoice(seg.text);
        }
        
        return prev + 1;
      });
    }, 1000);
  };

  const stopPresentation = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (recorderRef.current) recorderRef.current.stop();
    setIsPlaying(false);
    setIsRecording(false);
    setStatus('finished');
  };

  const downloadVideo = () => {
    const blob = new Blob(recordedChunks, { type: 'video/mp4' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GhostChain_Omega_Conest_Submission_${Date.now()}.mp4`;
    a.click();
  };

  const [uploading, setUploading] = useState(false);
  const uploadToVault = async () => {
    setUploading(true);
    const blob = new Blob(recordedChunks, { type: 'video/mp4' });
    try {
      const res = await fetch('/api/vaults/upload-video', {
        method: 'POST',
        headers: { 'Content-Type': 'video/mp4' },
        body: blob
      });
      if (res.ok) {
        alert("Video successfully archived in the Sovereign Vault.");
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-8 backdrop-blur-3xl">
      <div className="max-w-6xl w-full h-full flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-blue-600 rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.4)]">
                <Video className="text-white" />
             </div>
             <div>
                <h1 className="text-2xl font-black text-white uppercase tracking-tighter italic">AI <span className="text-blue-500 font-sans not-italic">Presentation Engine</span></h1>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">3-Minute High-Fidelity Contest Submission</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Visual Preview */}
          <Card 
            ref={videoRef}
            className="lg:col-span-2 bg-[#050505] border-white/10 relative overflow-hidden flex flex-col items-center justify-center text-center p-12 group"
          >
            <AnimatePresence mode="wait">
               {currentSegment ? (
                 <motion.div 
                   key={currentSegment.time}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -20 }}
                   className="space-y-8"
                 >
                    <Badge variant="success" className="animate-pulse py-2 px-6 text-sm">{currentSegment.heading}</Badge>
                    <div className="relative">
                       <h2 className="text-5xl font-black text-white leading-tight uppercase max-w-2xl mx-auto italic">
                          GhostChain <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Omega</span> Totality
                       </h2>
                       <div className="absolute -inset-20 bg-blue-500/5 blur-[100px] pointer-events-none" />
                    </div>
                    <div className="flex justify-center gap-12">
                       <div className="text-center">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Architecture</p>
                          <p className="text-xl font-mono text-white">X402_MESH</p>
                       </div>
                       <div className="text-center">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Standard</p>
                          <p className="text-xl font-mono text-white">ERC_8004</p>
                       </div>
                    </div>
                 </motion.div>
               ) : (
                 <div className="space-y-6">
                    <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto opacity-20" />
                    <p className="text-slate-500 font-mono text-sm">Waiting for neural sync...</p>
                 </div>
               )}
            </AnimatePresence>

            <div className="absolute bottom-12 left-0 right-0 px-12">
               <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                 <motion.div 
                    animate={{ width: `${(currentTime / 180) * 100}%` }}
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 shadow-[0_0_20px_rgba(37,99,235,0.5)]"
                 />
               </div>
               <div className="flex justify-between mt-3">
                  <span className="text-[10px] font-mono text-slate-500">{Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')}</span>
                  <span className="text-[10px] font-mono text-slate-500">3:00</span>
               </div>
            </div>
          </Card>

          {/* Controls & Script List */}
          <div className="space-y-6 flex flex-col">
            <Card className="bg-black/60 border-white/5 p-6 space-y-6">
               <div className="flex items-center gap-3">
                 <Mic className="text-blue-400" size={18} />
                 <h4 className="text-[11px] font-black text-white uppercase tracking-widest italic">Recording <span className="text-blue-500 font-sans not-italic">Parameters</span></h4>
               </div>

               <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Instructions for Level-AI Hackathon</p>
                     <ol className="text-[10px] text-slate-400 space-y-2 list-decimal list-inside leading-relaxed">
                        <li>Ensure you share your **entire screen** when prompted.</li>
                        <li>This recording will capture live UI transitions.</li>
                        <li>Final output will be a 3-minute MP4 file.</li>
                     </ol>
                  </div>
               </div>

               {!isPlaying && status !== 'finished' ? (
                 <Button 
                   onClick={startPresentation}
                   className="w-full bg-blue-600 hover:bg-blue-500 text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(37,99,235,0.3)] transition-all active:scale-95 group"
                 >
                   <Play className="group-hover:translate-x-1 transition-transform" />
                   Begin Recording Sequence
                 </Button>
               ) : (
                 <div className="flex gap-4">
                    {status === 'finished' ? (
                      <div className="flex flex-col gap-3 w-full">
                        <Button 
                          onClick={downloadVideo}
                          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em]"
                        >
                           <Download size={20} className="mr-2" />
                           Download MP4
                        </Button>
                        <Button 
                          onClick={uploadToVault}
                          disabled={uploading}
                          variant="ghost"
                          className="w-full bg-blue-500/10 text-blue-400 py-6 rounded-2xl font-black uppercase tracking-[0.2em] border border-blue-500/20"
                        >
                           <Rocket size={18} className={`mr-2 ${uploading ? 'animate-bounce' : ''}`} />
                           {uploading ? 'Syncing...' : 'Upload to Sovereign Vault'}
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        onClick={stopPresentation}
                        variant="ghost"
                        className="flex-1 bg-rose-500/10 text-rose-500 py-6 rounded-2xl font-black uppercase tracking-[0.2em]"
                      >
                         Stop Sequence
                      </Button>
                    )}
                 </div>
               )}
            </Card>

            <Card className="flex-1 bg-black/60 border-white/5 p-6 overflow-hidden flex flex-col">
               <div className="flex items-center gap-3 mb-6">
                 <Monitor className="text-blue-400" size={18} />
                 <h4 className="text-[11px] font-black text-white uppercase tracking-widest">Master Narrative</h4>
               </div>
               <div className="flex-1 overflow-y-auto space-y-4 scrollbar-thin pr-2">
                  {PRESENTATION_SCRIPT.map((s, i) => (
                    <div key={i} className={`p-4 rounded-2xl border transition-all ${currentSegment?.time === s.time ? 'bg-blue-500/10 border-blue-500/30' : 'bg-white/5 border-white/5 opacity-40'}`}>
                       <p className="text-[10px] font-black text-white uppercase mb-2">{s.heading}</p>
                       <p className="text-[10px] text-slate-400 leading-relaxed font-mono">{s.text}</p>
                    </div>
                  ))}
               </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
