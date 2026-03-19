import { useGame } from '../context/GameContext';
import { Card } from './Card';
import { motion } from 'framer-motion';
import { Button } from './Button';
import { CheckCircle2 } from 'lucide-react';

export const UserDashboard = () => {
  const { currentUser, resetGame } = useGame();

  if (!currentUser) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-8 py-12"
    >
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 text-green-500 mb-4">
            <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-bold text-white">Validation Complete</h1>
        <p className="text-zinc-400">Thank you for completing the AI Validator challenge.</p>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800 p-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-8 border-b border-zinc-800">
            <div className="text-center md:text-left">
                <div className="text-sm text-zinc-500 font-mono mb-1">CANDIDATE</div>
                <div className="text-3xl font-bold text-white font-mono">{currentUser.regNo}</div>
            </div>
            <div className="text-center md:text-right">
                <div className="text-sm text-zinc-500 font-mono mb-1">FINAL SCORE</div>
                <div className="text-5xl font-bold text-indigo-500">{currentUser.totalScore}/30</div>
            </div>
        </div>

        <div className="grid gap-6 mt-8">
            <h3 className="text-sm font-mono text-zinc-400 uppercase tracking-wider">Performance Breakdown</h3>
            
            {['task1', 'task2', 'task3'].map((taskId) => {
                  const task = currentUser.tasks[taskId as keyof typeof currentUser.tasks];
                  if (!task) return null;
                  
                  return (
                    <div key={taskId} className="bg-zinc-950/50 rounded-lg p-4 border border-zinc-800/50">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-indigo-400 font-bold uppercase text-sm">{taskId}</span>
                            <span className="text-white font-mono font-bold">{task.score}/10</span>
                        </div>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                            {task.feedback}
                        </p>
                        {task.metrics && (
                            <div className="flex gap-4 mt-3 text-xs font-mono text-zinc-500">
                                <span>CREATIVITY: {task.metrics.creativity}</span>
                                <span>NOVELTY: {task.metrics.novelty}</span>
                                <span>CONTENT: {task.metrics.content}</span>
                            </div>
                        )}
                    </div>
                  )
            })}
        </div>
      </Card>

      <div className="flex justify-center">
        <Button onClick={resetGame} className="bg-zinc-800 hover:bg-zinc-700 text-white">
            Return to Home
        </Button>
      </div>
    </motion.div>
  );
};
