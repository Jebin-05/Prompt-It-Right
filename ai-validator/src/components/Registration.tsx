import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';
import { useGame } from '../context/GameContext';
import { Card } from './Card';
import { Cpu } from 'lucide-react';

export const Registration = () => {
  const { registerUser } = useGame();
  const [regNo, setRegNo] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNo.trim()) {
      setError('Registration Number is required');
      return;
    }
    // Simple validation for URK format if needed, e.g., /^URK\d{8}$/i
    if (!regNo.toUpperCase().startsWith('URK')) {
        setError('Format must start with URK (e.g., URK23CS1010)');
        return;
    }
    
    registerUser(regNo.toUpperCase());
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto py-20"
    >
      <div className="text-center space-y-8 mb-12">
        <div className="flex justify-center">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center">
              <Cpu className="w-8 h-8 text-white" />
            </div>
        </div>
        <div>
            <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
            AI Validator
            </h1>
            <p className="text-zinc-400">Enter your credentials to begin validation sequence.</p>
        </div>
      </div>

      <Card className="border-zinc-800 bg-zinc-900/50 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="regNo" className="text-sm font-mono text-zinc-400">
              REGISTER_NUMBER
            </label>
            <input
              id="regNo"
              type="text"
              value={regNo}
              onChange={(e) => {
                  setRegNo(e.target.value);
                  setError('');
              }}
              placeholder="URK..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
            {error && <p className="text-red-400 text-xs font-mono">{error}</p>}
          </div>

          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white">
            Initialize Session
          </Button>
        </form>
      </Card>
    </motion.div>
  );
};
