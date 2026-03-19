# AI Validator SaaS - Implementation Plan

## Overview
A gamified SaaS application to test students' ability to communicate with AI.
- **Tech Stack**: React (Vite + TypeScript), Tailwind CSS, Framer Motion.
- **AI Model**: Google Gemini 3.1 Pro via OpenRouter.
- **Theme**: Dark, minimalist, "React Bits" style (high-quality animations), no decorative images/emojis.

## Core Features
1.  **Task 1: The Persona Architect**
    -   Input: User writes a prompt for a specific scenario (Mars repair).
    -   Process: Send prompt to AI -> AI acts as persona -> Evaluate response.
    -   Scoring: AI evaluates its own output based on criteria (Tone, Accuracy).

2.  **Task 2: The Reverse Visionary**
    -   Input: User sees a *description* of an image (due to "no images" constraint) and writes the prompt.
    -   Process: Compare user's prompt to the original prompt semantically.
    -   Scoring: AI compares semantic similarity.

3.  **Task 3: The Boundary Challenge**
    -   Input: User explains a concept (PB&J) without forbidden words.
    -   Process: Check for forbidden words (Client-side regex) -> Send to AI to verify clarity/correctness.
    -   Scoring: Pass/Fail based on constraints + AI clarity score.

## Architecture
-   **Frontend**: Single Page Application (SPA).
-   **State Management**: React Context (`GameContext`).
-   **API Integration**: `OpenRouterService` class.

## Project Structure
-   `src/components/`: Reusable UI components (Button, Input, Card).
-   `src/features/`: Task-specific logic (Task1, Task2, Task3).
-   `src/services/`: API handling.
-   `src/App.tsx`: Main layout and game loop.

## Design
-   **Colors**: Slate/Zinc dark mode (bg-zinc-950, text-zinc-200).
-   **Typography**: Monospace (for code/terminal feel) + Sans-serif.
-   **Animations**: Framer Motion for smooth transitions between tasks.

## Steps
1.  Initialize React project.
2.  Install dependencies (framer-motion, tailwind, lucide-react).
3.  Configure Tailwind & Global Styles.
4.  Implement OpenRouter Service.
5.  Build Game Context (State).
6.  Build Task Components (1, 2, 3).
7.  Assemble Main App.
8.  Test & Refine.
