import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { TextArea } from '../components/Input';
import { useGame } from '../context/GameContext';
import { OpenRouterService } from '../services/OpenRouterService';
import { extractJson } from '../utils/jsonUtils';
import { Crown } from 'lucide-react';

export const Task3 = () => {
  const { submitTask } = useGame();
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);

    try {
      const evaluationPrompt = `
        Evaluate this User's Submission for the "Ultimate AI Challenge".
        
        User Submission: "${prompt}"
        
        Task: 
        Rank this submission based on its depth, innovation, and potential impact.
        This is a competition. We need to find the BEST ideas.
        
        Criteria:
        1. Innovation (0-10): Is the idea truly new?
        2. Feasibility (0-10): Is it grounded in reality?
        3. Impact (0-10): How significant would this be?
        
        Output JSON only:
        {
          "metrics": {
            "creativity": (0-10),
            "novelty": (0-10),
            "content": (0-10)
          },
          "score": (average of metrics, rounded to nearest int),
          "feedback": "Why this stands out (or doesn't)."
        }
      `;

      const evalResponse = await OpenRouterService.generateCompletion([
        { role: 'user', content: evaluationPrompt }
      ], 0.7, 1000);

      if (evalResponse.error) {
        throw new Error(evalResponse.error);
      }

      const evalData = extractJson(evalResponse.content);

      submitTask('task3', {
        score: evalData.score || 0,
        feedback: evalData.feedback || "Evaluation failed",
        metrics: evalData.metrics || { creativity: 0, novelty: 0, content: 0 },
        prompt: prompt
      });
    } catch (error) {
      console.error(error);
      submitTask('task3', {
        score: 0,
        feedback: "Error evaluating response.",
        prompt: prompt
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3 text-zinc-400 mb-2">
          <Crown className="w-5 h-5" />
          <span className="text-sm font-mono tracking-wider">TASK_03_GRAND_CHALLENGE</span>
        </div>
        <h1 className="text-4xl font-bold text-white">The Grand Challenge</h1>
        <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl">
          Objective: Propose a revolutionary application of AI that could change a specific industry.
          <br />
          <span className="text-yellow-500 font-mono text-sm mt-2 block">
            This task will determine your Final Rank. Make it count.
          </span>
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-8">
        <Card className="h-full border-zinc-800 bg-zinc-900/30">
          <div className="space-y-4">
            <TextArea
              label="Strategic Cortex // Enter Proposal"
              placeholder="e.g., AI-driven vertical farming optimization..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="h-64 font-mono text-sm bg-zinc-950/50"
            />
            <Button 
              onClick={handleSubmit} 
              isLoading={isLoading} 
              className="w-full bg-yellow-600 hover:bg-yellow-500 text-white"
            >
              Submit Final Proposal
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
