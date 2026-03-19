import { GameProvider, useGame } from './context/GameContext';
import { Task1 } from './features/Task1';
import { Task2 } from './features/Task2';
import { Task3 } from './features/Task3';
import { Registration } from './components/Registration';
import { UserDashboard } from './components/UserDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu } from 'lucide-react';

const GameContainer = () => {
  const { currentStage, isAdminMode, toggleAdminMode, currentUser } = useGame();

  if (isAdminMode) {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={toggleAdminMode}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">AI_VALIDATOR</span>
          </div>
          <div className="flex gap-4 text-sm font-mono text-zinc-500">
             {currentUser && <span className="text-indigo-400">{currentUser.regNo}</span>}
             <span className="text-zinc-700">|</span>
             <span>SYSTEM_ONLINE</span>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {currentStage === 'intro' && (
            <Registration key="registration" />
          )}

          {currentStage === 'task1' && (
            <motion.div key="task1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Task1 />
            </motion.div>
          )}

          {currentStage === 'task2' && (
            <motion.div key="task2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Task2 />
            </motion.div>
          )}

          {currentStage === 'task3' && (
            <motion.div key="task3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Task3 />
            </motion.div>
          )}
          
          {currentStage === 'completed' && (
             <UserDashboard key="completed" />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

function App() {
  return (
    <GameProvider>
      <GameContainer />
    </GameProvider>
  );
}

export default App;
