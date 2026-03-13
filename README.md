# ⚙️ Servix: Foundational AI Agent Architecture

**Servix** is a custom-built, vanilla Python AI Agent designed from the ground up. It was created specifically as an educational initiative to understand the inner workings of modern agentic frameworks (like **LangChain** or **LlamaIndex**) without relying on their powerful, but heavily abstracted, black-box libraries.

If you want to learn *how* an agent reasons, selects tools, and manages state under the hood, this repository serves as a foundational blueprint.

---

## 🏗️ Architecture Overview

Servix operates on an improvised **ReAct (Reason + Act)** loop. Rather than importing a pre-built agent executor, the entire orchestration pipeline is hand-coded.

### The Core Loop (`agent/core.py`)
The heart of Servix is the orchestration loop. It manages the conversational flow by:
1. Ingesting user prompts.
2. Sending the context to the LLM (`agent/llm_client.py`).
3. Parsing the LLM's response to determine if a tool needs to be executed, or if a final conversational response can be returned.
4. Calling the appropriate tool and injecting the result back into the prompt until the objective is completed.

### Dynamic Tool Injection (`tools/registry.py` & `agent/prompt_builder.py`)
Tools are defined as standard Python functions and mapped within the `registry.py`. The `prompt_builder.py` dynamically reads this registry and constructs the System Prompt, injecting the tool descriptions and formatting instructions directly into the LLM's context window.

### API Layer (`server.py`)
The entire agentic loop is exposed as a RESTful API using **FastAPI**. It handles complex `multipart/form-data` requests, allowing the Agent to process standard text messages alongside attached `.pdf`, `.docx`, and `.txt` documents simultaneously. 

### Frontend UI (`frontend-agent/`)
The repository includes a custom **Next.js 14** web client featuring a deeply customized **Neo-Brutalist Industrial** aesthetic. Built with Tailwind CSS, it supports:
- Real-time Markdown parsing and syntax highlighting (`react-markdown`, `Prism`).
- Interactive file attachments with inline previews.
- Dynamic network routing for cross-device local testing.

---

## 🧠 Memory Management
Currently, Servix implements **Basic Temporary Memory**. It maintains conversational context within the active execution loop, appending user queries, tool executions, and LLM thoughts to the message history. 

### 🚀 Future Roadmap
- **Persistent Memory Integration**: Future versions will implement Vector Databases (or Vectorless RAG techniques) to provide the agent with long-term memory retrieval and semantic context persistence across sessions.

---

## 🛠️ File Structure

```text
BasicAIAgent/
├── agent/
│   ├── core.py               # Improvised ReAct orchestrator loop
│   ├── llm_client.py         # HuggingFace API integration & raw text generation
│   ├── prompt_builder.py     # System prompt engine & dynamic tool injection
│   └── tool_executor.py      # Safely executes requested tools and handles errors
├── tools/
│   ├── registry.py           # Centralized mapping of available tools
│   ├── weather.py            # Example Tool: Live weather fetching
│   └── dateAndTime.py        # Example Tool: System clock access
├── utils/
│   └── file_parser.py        # Extracts raw text from .pdf and .docx attachments
├── frontend-agent/           # Next.js 14 Neo-Brutalist Chat UI
├── server.py                 # FastAPI backend entry point
└── .env                      # API Keys and Environment Variables
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js (for the Next.js frontend)
- A Hugging Face API Token

### 1. Backend Setup (FastAPI)
Clone the repository and install the Python dependencies:
```bash
pip install fastapi uvicorn python-dotenv pydantic requests python-docx PyMuPDF huggingface_hub
```

Create a `.env` file in the root directory:
```env
HF_TK=your_hugging_face_token_here
AGENT_SYSTEM_PROMPT=You are Servix, an intelligent assistant...
```

Start the FastAPI server:
```bash
python server.py
# Or run with Uvicorn directly: uvicorn server:app --reload
```

### 2. Frontend Setup (Next.js)
Open a new terminal and navigate to the frontend directory:
```bash
cd frontend-agent
npm install
npm run dev
```
The Neo-Brutalist Chat interface will be available at `http://localhost:3000`.

---

## 🎓 Educational Value
By examining this codebase, you will learn:
- How to construct a System Prompt that forces an LLM to output parseable JSON tool commands.
- The mechanics of capturing LLM hallucinated tool calls and executing them safely.
- How to manage the API context window by appending tool execution results manually.
- The architectural separation between the "Brain" (LLM Client), the "Hands" (Tool Executor), and the "Mouth" (FastAPI UI endpoints).

*Built to demystify Agentic AI.*
