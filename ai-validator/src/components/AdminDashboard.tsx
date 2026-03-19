import { useGame } from '../context/GameContext';
import { Card } from '../components/Card';
import { motion } from 'framer-motion';
import { Download, Trophy } from 'lucide-react';

export const AdminDashboard = () => {
  const { allUsers, toggleAdminMode } = useGame();

  // Sort users by total score descending
  const sortedUsers = [...allUsers].sort((a, b) => b.totalScore - a.totalScore);

  const downloadCSV = () => {
    const headers = ['Rank', 'Register No', 'Total Score', 'Task 1 Score', 'Task 1 Prompt', 'Task 2 Score', 'Task 2 Prompt', 'Task 3 Score', 'Task 3 Prompt'];
    const rows = sortedUsers.map((u, index) => [
      index + 1,
      u.regNo,
      u.totalScore,
      u.tasks.task1?.score || 0,
      `"${u.tasks.task1?.prompt.replace(/"/g, '""') || ''}"`,
      u.tasks.task2?.score || 0,
      `"${u.tasks.task2?.prompt.replace(/"/g, '""') || ''}"`,
      u.tasks.task3?.score || 0,
      `"${u.tasks.task3?.prompt.replace(/"/g, '""') || ''}"`,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'ai_validator_results.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto space-y-8 p-8"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Admin Dashboard // Leaderboard
        </h1>
        <div className="flex gap-4">
            <button 
                onClick={downloadCSV}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 rounded-lg text-white hover:bg-green-500 transition-colors font-mono text-sm"
            >
                <Download className="w-4 h-4" /> EXPORT_CSV
            </button>
            <button 
                onClick={toggleAdminMode}
                className="px-4 py-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors font-mono text-sm"
            >
                EXIT_ADMIN
            </button>
        </div>
      </div>

      <div className="grid gap-6">
        {sortedUsers.length === 0 ? (
          <div className="text-center text-zinc-500 py-20 font-mono">NO_SUBMISSIONS_LOGGED</div>
        ) : (
          sortedUsers.map((user, idx) => (
            <Card key={idx} className="bg-zinc-900/50 border-zinc-800 p-6 relative overflow-hidden group hover:border-zinc-700 transition-colors">
              
              {/* Rank Badge */}
              <div className="absolute top-0 right-0 p-4">
                 <div className={`text-4xl font-bold opacity-20 group-hover:opacity-40 transition-opacity ${
                    idx === 0 ? 'text-yellow-500' : 
                    idx === 1 ? 'text-zinc-400' : 
                    idx === 2 ? 'text-amber-700' : 'text-zinc-800'
                 }`}>
                    #{idx + 1}
                 </div>
              </div>

              <div className="flex justify-between items-start mb-6 border-b border-zinc-800 pb-4 pr-16">
                <div>
                  <h2 className="text-2xl font-bold text-white font-mono tracking-wider">{user.regNo}</h2>
                  <p className="text-xs text-zinc-500 font-mono mt-1">{new Date(user.timestamp).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-indigo-400 font-mono">{user.totalScore}<span className="text-lg text-zinc-600">/30</span></div>
                  <div className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">Cumulative Score</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['task1', 'task2', 'task3'].map((taskId) => {
                  const task = user.tasks[taskId as keyof typeof user.tasks];
                  return (
                    <div key={taskId} className="space-y-3">
                      <div className="flex justify-between text-sm items-center">
                        <span className="text-zinc-400 font-mono uppercase text-xs tracking-wider">{taskId}</span>
                        <span className={`font-mono font-bold ${task ? "text-white" : "text-zinc-600"}`}>
                          {task ? `${task.score}` : 'DNS'}
                        </span>
                      </div>
                      {task ? (
                        <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800/50 space-y-3">
                           <div className="text-zinc-400 text-xs italic line-clamp-3 leading-relaxed">
                             "{task.prompt}"
                           </div>
                           
                           <div className="h-px bg-zinc-800/50 w-full" />
                           
                           <div className="text-zinc-300 text-xs leading-relaxed">
                             <span className="text-indigo-500 font-mono text-[10px] uppercase block mb-1">Feedback</span>
                             {task.feedback}
                           </div>

                           {task.metrics && (
                             <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-zinc-800/50">
                                <div className="text-center">
                                    <div className="text-[10px] text-zinc-600 font-mono uppercase">Cre</div>
                                    <div className="text-xs font-bold text-zinc-300">{task.metrics.creativity}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-[10px] text-zinc-600 font-mono uppercase">Nov</div>
                                    <div className="text-xs font-bold text-zinc-300">{task.metrics.novelty}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-[10px] text-zinc-600 font-mono uppercase">Con</div>
                                    <div className="text-xs font-bold text-zinc-300">{task.metrics.content}</div>
                                </div>
                             </div>
                           )}
                        </div>
                      ) : (
                        <div className="h-24 flex items-center justify-center border border-dashed border-zinc-800 rounded-lg">
                            <span className="text-zinc-700 text-xs font-mono">NO_DATA</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          ))
        )}
      </div>
    </motion.div>
  );
};
