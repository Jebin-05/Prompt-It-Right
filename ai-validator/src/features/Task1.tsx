import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { TextArea } from '../components/Input';
import { useGame } from '../context/GameContext';
import { OpenRouterService } from '../services/OpenRouterService';
import { extractJson } from '../utils/jsonUtils';
import { Terminal, Upload, X, ImageIcon } from 'lucide-react';

export const Task1 = () => {
  const { submitTask } = useGame();
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!prompt.trim() || !image) return;
    setIsLoading(true);

    try {
      // Evaluation Prompt
      const evaluationPrompt = `
        You are an AI Validator. 
        Analyze the User's Prompt and the User's Uploaded Image.
        
        User Prompt: "${prompt}"
        
        Task: Validate if the image matches the prompt and evaluate the quality of the concept.
        
        Criteria:
        1. Creativity (0-10): How inventive is the prompt/image concept?
        2. Novelty (0-10): Is it a unique idea?
        3. Content Delivery (0-10): Does the image actually match the description in the prompt?
        
        Output JSON only:
        {
          "metrics": {
            "creativity": (0-10),
            "novelty": (0-10),
            "content": (0-10)
          },
          "score": (average of metrics, rounded to nearest int),
          "feedback": "Brief explanation of the score."
        }
      `;

      const content = [
        { type: "text", text: evaluationPrompt },
        { type: "image_url", image_url: { url: image } }
      ];

      // Note: We cast content to any because our service update handles the array but TS might strictly expect string depending on old definition
      // Actually we updated the service definition so this should be fine if we fix the service file correctly.
      const evalResponse = await OpenRouterService.generateCompletion([
        { role: 'user', content: content as any }
      ], 0.7, 1000);

      if (evalResponse.error) {
        throw new Error(evalResponse.error);
      }

      if (!evalResponse.content) {
        throw new Error("AI returned no content for the evaluation.");
      }

      const evalData = extractJson(evalResponse.content);

      submitTask('task1', {
        score: evalData.score || 0,
        feedback: evalData.feedback || "Evaluation failed",
        metrics: evalData.metrics || { creativity: 0, novelty: 0, content: 0 },
        prompt: prompt
      });

    } catch (error) {
      console.error(error);
      submitTask('task1', {
        score: 0,
        feedback: "Error processing request: " + (error instanceof Error ? error.message : "Unknown"),
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
          <Terminal className="w-5 h-5" />
          <span className="text-sm font-mono tracking-wider">TASK_01_VISUAL_VALIDATOR</span>
        </div>
        <h1 className="text-4xl font-bold text-white">The Visual Validator</h1>
        <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl">
          Objective: Provide a creative 
          <span className="text-zinc-200 font-semibold"> Prompt </span> 
          and upload a corresponding
          <span className="text-zinc-200 font-semibold"> Image </span>
          to be validated for accuracy and creativity.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-8">
        <Card className="h-full border-zinc-800 bg-zinc-900/30">
          <div className="space-y-6">
            <TextArea
              label="System Interface // Enter Prompt"
              placeholder="e.g., A futuristic city made of crystal..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="h-32 font-mono text-sm bg-zinc-950/50"
            />
            
            <div className="space-y-2">
                <label className="text-sm font-mono text-zinc-400 block">
                    UPLOAD_SOURCE_IMAGE
                </label>
                {!image ? (
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-zinc-800 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-500 hover:bg-zinc-900/50 transition-colors"
                    >
                        <Upload className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
                        <p className="text-zinc-400 text-sm">Click to upload image</p>
                        <p className="text-zinc-600 text-xs mt-1">Supports JPG, PNG</p>
                    </div>
                ) : (
                    <div className="relative rounded-lg overflow-hidden border border-zinc-700 bg-zinc-950">
                        <img src={image} alt="Preview" className="w-full h-64 object-contain" />
                        <button 
                            onClick={removeImage}
                            className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-red-600/80 rounded-full text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 rounded text-xs text-white font-mono flex items-center gap-1">
                            <ImageIcon className="w-3 h-3" />
                            IMAGE_LOADED
                        </div>
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
              disabled={!prompt.trim() || !image}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit for Validation
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
