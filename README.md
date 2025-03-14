# Readme

**CV Analyzer** is a tool that allows you to upload a CV and evaluate how well it fits a specific job position using AI. By providing the required position in a prompt, the AI analyzes the content of the CV and returns a fit assessment, helping streamline the candidate screening process. The result is a concise analysis with a percentage-based fit score and key feedback to assist in decision-making.

### Features:

1. Upload a CV (.pdf/.doc/.docx)
2. Provide a job position and some requirements as a prompt
3. AI-powered analysis of CV fit for the specified position
4. Clear and structured output with percentage fit score

## Dockerization

This application is containerized using Docker. It consists of two main services:

1. **Ollama Service:**

   - The `ollama/ollama` [docker image](https://hub.docker.com/r/ollama/ollama) runs in its own container, providing the AI model for CV analysis.

2. **Frontend Application:**
   - The frontend application runs in a separate container, allowing users to interact with the CV Analyzer through a web interface.

### Running the Application with Docker

To run the application using Docker, follow these steps:

1. **Build and Start the Containers:**
   Make sure you have Docker and Docker Compose installed. Then, run the following command in the root directory of the project:

   ```bash
   docker-compose up --build
   ```

2. **Access the Application:**
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Local Development

If you prefer to run the application locally without Docker, you can do so by following these steps:

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
