# Prompt-It-Right

A gamified AI prompt engineering challenge application built with React, TypeScript, and Vite.

## Project Overview

This repository contains the source code for "AI Validator" (Prompt-It-Right), an interactive web application designed to test and improve prompt engineering skills through a series of tasks.

### Features
- **Interactive Challenges:** Three distinct tasks to test different aspects of prompting.
- **AI Integration:** Uses OpenRouter API to evaluate prompts against AI models.
- **Admin & User Dashboards:** Separate interfaces for administrators and participants.
- **Real-time Validation:** Instant feedback on prompt performance.

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```bash
   cd ai-validator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   - Copy the example environment file:
     ```bash
     cp .env.example .env
     ```
   - Open `.env` and add your OpenRouter API Key:
     ```
     VITE_OPENROUTER_API_KEY=your_api_key_here
     ```
   > **Note:** The `.env` file is git-ignored to protect your API keys. Never commit this file.

### Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Project Structure

- `src/components`: Reusable UI components (Dashboard, Registration, etc.)
- `src/features`: core logic for Task 1, Task 2, and Task 3.
- `src/services`: API integration services (OpenRouter).
- `src/context`: React context for state management.

## License

[MIT](LICENSE)
