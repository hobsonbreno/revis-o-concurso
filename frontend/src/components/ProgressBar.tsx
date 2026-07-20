interface ProgressBarProps {
  progress: number;
  message: string;
}

export default function ProgressBar({ progress, message }: ProgressBarProps) {
  return (
    <div className="w-full bg-surface p-6 rounded-2xl border border-gray-800 shadow-2xl relative overflow-hidden">
      {/* Glow background effect */}
      <div 
        className="absolute -inset-4 bg-primary/10 blur-xl opacity-50 transition-opacity" 
      />
      
      <div className="relative">
        <div className="flex justify-between text-sm mb-4 font-semibold">
          <span className="text-gray-200">{message}</span>
          <span className="text-primary">{progress}%</span>
        </div>
        <div className="w-full bg-gray-900 rounded-full h-4 overflow-hidden border border-gray-700">
          <div 
            className="bg-gradient-to-r from-primary via-blue-400 to-purple-500 h-4 rounded-full transition-all duration-700 ease-out relative"
            style={{ width: `${Math.max(progress, 2)}%` }}
          >
            {/* Shimmer animation on the bar */}
            <div className="absolute inset-0 bg-white/20 w-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
