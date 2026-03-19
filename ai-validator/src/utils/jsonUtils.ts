export const extractJson = (text: string) => {
  if (!text) return { score: 0, feedback: "No response from AI" };
  
  // 1. Try simple parse first
  try {
    return JSON.parse(text);
  } catch (e) {
    // Continue
  }

  // 2. Try to find a JSON object block { ... }
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (e) {
      // Continue
    }
  }

  // 3. Try cleaning markdown blocks explicitly
  const cleanText = text.replace(/```json|```/g, '').trim();
  try {
    return JSON.parse(cleanText);
  } catch (e) {
    console.error("JSON Parse Error. Raw text:", text);
    // Return a default error object instead of crashing the app
    return { 
      score: 0, 
      feedback: "Failed to parse AI response. The model returned invalid data." 
    };
  }
};
