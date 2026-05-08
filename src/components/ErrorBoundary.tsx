import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center font-mono">
          <AlertTriangle className="w-16 h-16 text-rose-500 mb-4 animate-pulse" />
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">
            Neural Pathway Fault Detected
          </h1>
          <p className="text-slate-500 max-w-md mb-8 text-sm">
            The GhostChain interface encountered a critical runtime exception. The autonomous evolution loop may be out of sync.
          </p>
          <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl mb-8 max-w-2xl w-full text-left overflow-auto max-h-48">
            <code className="text-rose-400 text-xs">
              {this.state.error?.toString()}
            </code>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-ghost-accent text-black px-6 py-3 rounded-xl font-black uppercase text-sm hover:bg-ghost-accent/90 transition-all shadow-lg shadow-ghost-accent/20"
          >
            <RefreshCw className="w-4 h-4" />
            Re-Initialize Matrix
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
