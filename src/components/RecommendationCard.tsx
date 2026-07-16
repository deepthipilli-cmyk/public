import { Sparkles } from "lucide-react";
import { motion } from "motion/react";
import Markdown from 'react-markdown';

interface RecommendationCardProps {
  recommendation: string | null;
  isLoading: boolean;
}

export function RecommendationCard({ recommendation, isLoading }: RecommendationCardProps) {
  if (!recommendation && !isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto mt-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-[1px]"
    >
      <div className="bg-white rounded-[23px] p-6 sm:p-8 h-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-50 rounded-xl">
            <Sparkles size={20} className="text-indigo-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">AI Planning Assistant</h3>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col gap-3 animate-pulse">
            <div className="h-4 bg-slate-100 rounded-full w-3/4"></div>
            <div className="h-4 bg-slate-100 rounded-full w-full"></div>
            <div className="h-4 bg-slate-100 rounded-full w-5/6"></div>
          </div>
        ) : (
          <div className="prose prose-slate prose-sm sm:prose-base max-w-none text-slate-600">
            <Markdown>{recommendation}</Markdown>
          </div>
        )}
      </div>
    </motion.div>
  );
}
