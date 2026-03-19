import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type TaskId = 'task1' | 'task2' | 'task3';
export type GameState = 'intro' | TaskId | 'completed';

export interface TaskResult {
  score: number;
  feedback: string;
  metrics?: {
    creativity: number;
    novelty: number;
    content: number;
  };
  prompt: string;
}

export interface UserData {
  regNo: string;
  tasks: {
    task1?: TaskResult;
    task2?: TaskResult;
    task3?: TaskResult;
  };
  totalScore: number;
  timestamp: number;
}

export interface GameContextType {
  currentUser: UserData | null;
  allUsers: UserData[];
  registerUser: (regNo: string) => void;
  submitTask: (taskId: TaskId, result: TaskResult) => void;
  isAdminMode: boolean;
  toggleAdminMode: () => void;
  currentStage: GameState;
  setStage: (stage: GameState) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [currentStage, setStage] = useState<GameState>('intro');
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [allUsers, setAllUsers] = useState<UserData[]>(() => {
    const stored = localStorage.getItem('ai_validator_users');
    return stored ? JSON.parse(stored) : [];
  });
  const [isAdminMode, setIsAdminMode] = useState(false);

  const registerUser = (regNo: string) => {
    setCurrentUser({
      regNo,
      tasks: {},
      totalScore: 0,
      timestamp: Date.now(),
    });
    setStage('task1');
  };

  const submitTask = (taskId: TaskId, result: TaskResult) => {
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      tasks: {
        ...currentUser.tasks,
        [taskId]: result,
      },
      totalScore: (currentUser.totalScore || 0) + result.score,
    };

    setCurrentUser(updatedUser);

    // If final task, save to history
    if (taskId === 'task3') {
      const newHistory = [...allUsers.filter(u => u.regNo !== updatedUser.regNo), updatedUser];
      setAllUsers(newHistory);
      localStorage.setItem('ai_validator_users', JSON.stringify(newHistory));
      setStage('completed');
    } else {
      const nextStage = taskId === 'task1' ? 'task2' : 'task3';
      setStage(nextStage);
    }
  };

  const toggleAdminMode = () => setIsAdminMode(!isAdminMode);

  const resetGame = () => {
    setStage('intro');
    setCurrentUser(null);
  };

  return (
    <GameContext.Provider value={{ 
      currentUser, 
      allUsers, 
      registerUser, 
      submitTask, 
      isAdminMode, 
      toggleAdminMode,
      currentStage, 
      setStage, 
      resetGame 
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
