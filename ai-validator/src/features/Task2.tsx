import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useGame } from '../context/GameContext';
import { OpenRouterService } from '../services/OpenRouterService';
import { extractJson } from '../utils/jsonUtils';
import { Eye, Upload, X, ImageIcon, CheckCircle } from 'lucide-react';

export const Task2 = () => {
  const { submitTask } = useGame();
  const [userImage, setUserImage] = useState<string | null>(null);
  const [targetImageBase64, setTargetImageBase64] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Path to the target image in public folder
  const TARGET_IMAGE_PATH = '/target_task2.svg'; 

  // Load target image as base64 for the AI
  useEffect(() => {
    const loadTarget = async () => {
      try {
        const response = await fetch(TARGET_IMAGE_PATH);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          setTargetImageBase64(reader.result as string);
        };
        reader.readAsDataURL(blob);
      } catch (e) {
        console.error("Failed to load target image", e);
      }
    };
    loadTarget();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setUserImage(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!userImage || !targetImageBase64) return;
    setIsLoading(true);

    try {
      const evaluationPrompt = `
        Compare the User Uploaded Image against the Target Image.
        
        Task: STRICTLY Compare the visual similarity between the two images.
        The User is trying to replicate the Target Image.
        
        Criteria:
        1. Visual Similarity (0-10): How close is the composition and shape?
        2. Element Matching (0-10): Are the key elements present?
        3. Precision (0-10): Is the execution accurate?
        
        BE VERY STRICT. A score of 10 requires pixel-perfect matching. 
        A score of 5 means vague resemblance.
        
        Output JSON only:
        {
          "metrics": {
            "similarity": (0-10),
            "elements": (0-10),
            "precision": (0-10)
          },
          "score": (average of metrics, rounded to nearest int),
          "feedback": "Explain the differences found."
        }
      `;

      // We send TWO images: Target and User
      const content = [
        { type: "text", text: evaluationPrompt },
        { type: "image_url", image_url: { url: targetImageBase64 } },
        { type: "image_url", image_url: { url: userImage } }
      ];

      const evalResponse = await OpenRouterService.generateCompletion([
        { role: 'user', content: content as any }
      ], 0.7, 1000);

      if (evalResponse.error) {
        throw new Error(evalResponse.error);
      }

      const evalData = extractJson(evalResponse.content);

      submitTask('task2', {
        score: evalData.score || 0,
        feedback: evalData.feedback || "Evaluation failed",
        metrics: { 
            creativity: evalData.metrics?.similarity || 0, // Mapping for unified interface
            novelty: evalData.metrics?.elements || 0,
            content: evalData.metrics?.precision || 0 
        },
        prompt: "[Image Upload Comparison]"
      });

    } catch (error) {
      console.error(error);
      submitTask('task2', {
        score: 0,
        feedback: "Error evaluating images.",
        prompt: "[Image Upload Error]"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3 text-zinc-400 mb-2">
          <Eye className="w-5 h-5" />
          <span className="text-sm font-mono tracking-wider">TASK_02_REPLICA_VALIDATOR</span>
        </div>
        <h1 className="text-4xl font-bold text-white">The Replica Challenge</h1>
        <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl">
          Objective: Upload an image that matches the 
          <span className="text-indigo-400 font-semibold"> TARGET </span> 
          below. 
          <br/>
          <span className="text-sm text-zinc-500">
            Validation is STRICT. Ensure high similarity.
          </span>
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Target Image Card */}
        <Card className="h-full border-zinc-800 bg-zinc-900/30">
            <div className="p-4 space-y-4">
                <div className="flex items-center gap-2 text-indigo-400 mb-2 font-mono text-sm">
                    <CheckCircle className="w-4 h-4" />
                    TARGET_REFERENCE
                </div>
                <div className="relative rounded-lg overflow-hidden border-2 border-indigo-500/30 bg-black aspect-video flex items-center justify-center">
                    <img src={TARGET_IMAGE_PATH} alt="Target" className="max-w-full max-h-full object-contain" />
                </div>
                <p className="text-zinc-500 text-sm text-center font-mono">
                    ID: IMG_REF_002 // CLASSIFIED
                </p>
            </div>
        </Card>

        {/* User Upload Card */}
        <Card className="h-full border-zinc-800 bg-zinc-900/30">
          <div className="p-4 space-y-6">
            <div className="flex items-center gap-2 text-zinc-400 mb-2 font-mono text-sm">
                <Upload className="w-4 h-4" />
                USER_SUBMISSION
            </div>
            
            <div className="space-y-2">
                {!userImage ? (
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-zinc-800 rounded-lg aspect-video flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-500 hover:bg-zinc-900/50 transition-colors"
                    >
                        <Upload className="w-10 h-10 text-zinc-500 mb-3" />
                        <p className="text-zinc-400 text-sm">Upload Attempt</p>
                        <p className="text-zinc-600 text-xs mt-1">Match the target</p>
                    </div>
                ) : (
                    <div className="relative rounded-lg overflow-hidden border border-zinc-700 bg-zinc-950 aspect-video flex items-center justify-center">
                        <img src={userImage} alt="User Upload" className="max-w-full max-h-full object-contain" />
                        <button 
                            onClick={removeImage}
                            className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-red-600/80 rounded-full text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    accept="image/*" 
                    className="hidden" 
                />
            </div>

            <Button 
              onClick={handleSubmit} 
              isLoading={isLoading} 
              disabled={!userImage || !targetImageBase64}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50"
            >
              Verify Match
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
