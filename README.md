# Readme

## Table of contents

1. [About the application](#about-the-application)
2. [Dockerization](#dockerization)
3. [Running the Application with Docker](#running-the-application-with-docker)
4. [Local development](#local-development)

## About the application

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

## Running the Application with Docker

To run the application using Docker, follow these steps:

1. **Add environment variable to `.env.local`**

   The ollama image runs on this port locally:
   `NEXT_PUBLIC_API_URL="http://localhost:11434"`

   If you want to deploy your application, change the variable to the appropriate option.

2. **Build and start the containers:**
   Make sure you have Docker and Docker Compose installed. Then, run the following command in the root directory of the project:

   `docker-compose up --build`

3. **Access the application:**
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Local Development

If you prefer to run the application locally without Docker, you can do so by following the steps below. It requires to have ollama setup on your local machine.

### 1. Install Ollama

First, download and install Ollama from the official [website](https://ollama.com/download). Once the download is complete, install the Ollama application like you would do for any other application.

Once the installation completes, confirm that Ollama is installed by checking its version:

```
ollama --version
```

When you run Ollama application, Ollama binds to the local address 127.0.0.1 on port 11434 by default (http://localhost:11434). You can change the bind address using the **OLLAMA_HOST** environment variable, see p.2 in useful links below.

#### Useful links:

1. [Language models that Ollama supports](https://ollama.com/library)
2. [Ollama Port Configuration Guide](https://www.restack.io/p/ollama-answer-port-configuration-cat-ai)
3. [Ollama API](https://github.com/ollama/ollama/blob/main/docs/api.md)

### 2. Pull the llama3.2 model

Once Ollama is installed, you can run Llama 3.2 models. You can download both the 1B and 3B versions using the Ollama CLI:

```
ollama pull llama3.2
ollama pull llama3.2:3b
```

This command fetches the model from the official Ollama repository and stores it locally.

> Note: Llama3.2 3B version requires more RAM and CPU resources.

To confirm that the model was downloaded successfully, run:

```
ollama list
```

It will show all the models that you have downloaded using Ollama.

> #### Where are models stored?
>
> - macOS: `~/.ollama/models`
> - Linux: `/usr/share/ollama/.ollama/models`
> - Windows: `C:\Users\%username%\.ollama\models`

Since the models are downloaded, you can run them locally with Ollama. You can start each model using the following commands:

```
ollama run llama3.2
ollama run llama3.2:3b
```

Once started, the model will run locally, and you can interact with it via the command line. But we're also using Llama model in this application.

### 3. Run the application

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
