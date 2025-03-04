# Readme

**CV Analyzer** is a tool that allows you to upload a CV and evaluate how well it fits a specific job position using AI. By providing the required position in a prompt, the AI analyzes the content of the CV and returns a fit assessment, helping streamline the candidate screening process. The result is a concise analysis with a percentage-based fit score and key feedback to assist in decision-making.

### Features:

1. Upload a CV (.pdf/.doc/.docx)
2. Provide a job position and some requirements as a prompt
3. AI-powered analysis of CV fit for the specified position
4. Clear and structured output with percentage fit score

## Getting Started

1. [Install Ollama](#install-ollama)
2. [Pull the DeepSeek-R1 Model](#pull-the-deepseek-r1-model)
3. [Run Frontend Application](#run-frontend-application)

## Install Ollama

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

## Pull the DeepSeek-R1 Model

Once Ollama is installed, you can run DeepSeek R1 models. You can download both the 1.5B and 7B versions using the Ollama CLI:

```
ollama pull deepseek-r1
ollama pull deepseek-r1:7b
```

This command fetches the model from the official Ollama repository and stores it locally.

> Note: DeepSeek-R1 7B version is significantly more powerful but requires more RAM and CPU resources.

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
ollama run deepseek-r1
ollama run deepseek-r1:7b
```

Once started, the model will run locally, and you can interact with it via the command line. But we're also using DeepSeek model in this application.

## Run Frontend Application

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
