"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Paperclip, FileText, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

type Message = {
  id: string;
  role: "user" | "agent";
  content: string;
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "agent",
      content: "Hello! I am your AI agent. How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!input.trim() && !attachedFile) || isLoading) return;

    let messageContent = input.trim();
    if (attachedFile) {
      messageContent += messageContent ? `\n[Attached File: ${attachedFile.name}]` : `[Attached File: ${attachedFile.name}]`;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageContent,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setAttachedFile(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("request_Message", messageContent); // Match backend Form name
      if (attachedFile) {
        formData.append("request_file", attachedFile); // Match backend File name
      }

      // Use the current hostname so it works from both localhost and your phone's network IP!
      const apiUrl = `http://${window.location.hostname}:8000/chat`;
      const response = await fetch(apiUrl, {
        method: "POST",
        // Note: Do NOT set Content-Type header manually when using FormData
        // The browser will automatically set it to multipart/form-data with the correct boundary
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to communicate with the agent");
      }

      const data = await response.json();

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "agent",
        content: data.response,
      };

      setMessages((prev) => [...prev, agentMessage]);
    } catch (error) {
      console.error("Error communicating with agent:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "agent",
        content: "Sorry, I encountered an error. Please try again or check if the server is running.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="h-screen w-full flex flex-col md:flex-row bg-[#000000] overflow-hidden font-sans text-white relative">
      {/* Left Action Panel - Safety Yellow */}
      <aside
        className={`${isSidebarOpen ? "w-full md:w-[30%] border-r-4 p-6 md:p-8" : "w-0 border-r-0 p-0"
          } bg-[#E2FF00] text-black flex flex-col justify-between border-b-4 md:border-b-0 border-black relative z-20 transition-all duration-300 ease-in-out`}
      >
        {/* Subtle Architectural Grid Background */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none transition-opacity duration-300"
          style={{
            backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
            opacity: isSidebarOpen ? 0.1 : 0
          }}
        />

        <div className={`relative z-10 transition-opacity duration-200 whitespace-nowrap overflow-hidden ${isSidebarOpen ? "opacity-100 delay-100" : "opacity-0"}`}>
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-12 h-12 bg-black text-[#E2FF00] shadow-[2px_2px_0px_#000000] border-2 border-black shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none text-black">
                SERVIX
              </h1>
              <p className="text-sm font-bold tracking-widest uppercase mt-1">AI SYS. // V1.0</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-black text-[#E2FF00] p-4 border-2 border-black shadow-[2px_2px_0px_#000000]">
              <h3 className="font-bold uppercase text-xs tracking-widest mb-1 opacity-80">System Status</h3>
              <p className="font-black text-xl uppercase">Online / Ready</p>
            </div>
          </div>
        </div>

        <div className={`relative z-10 mt-8 md:mt-0 whitespace-nowrap overflow-hidden transition-opacity duration-200 ${isSidebarOpen ? "opacity-100 delay-100" : "opacity-0"}`}>
          <p className="text-xs font-bold uppercase tracking-widest opacity-60">
            ENGINEERED FOR EXCELLENCE // PROTOCOL ALPHA
          </p>
        </div>
      </aside>

      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-6 h-12 bg-black border-2 border-white text-white hover:bg-[#E2FF00] hover:text-black hover:border-black transition-colors focus:outline-none hidden md:flex"
        style={{ left: isSidebarOpen ? 'calc(30% - 12px)' : '-2px' }}
        aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4 ml-1" />}
      </button>

      {/* Right Chat Area - Jet Black */}
      <section className="flex-1 w-full bg-[#000000] relative overflow-hidden flex flex-col transition-all duration-300 ease-in-out">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 scroll-smooth custom-scrollbar w-full max-w-4xl mx-auto"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : "flex-row"
                } animate-in fade-in duration-200`}
            >
              <div
                className={`flex items-center justify-center flex-shrink-0 w-10 h-10 border-2 border-white ${message.role === "user"
                  ? "bg-[#E2FF00] text-black border-[#E2FF00]" // Safety Yellow for User Icon
                  : "bg-black text-white" // Black for Agent Icon
                  }`}
              >
                {message.role === "user" ? (
                  <User className="w-5 h-5" />
                ) : (
                  <Bot className="w-5 h-5" />
                )}
              </div>

              <div
                className={`max-w-[85%] px-5 py-3.5 text-[15px] leading-relaxed border-2 ${message.role === "user"
                    ? "bg-[#E2FF00] text-black border-[#E2FF00] shadow-[2px_2px_0px_#ffffff]" // User Bubble
                    : "bg-[#111111] text-white border-white shadow-[2px_2px_0px_#ffffff] markdown-body" // Agent Bubble
                  }`}
              >
                {message.role === "user" ? (
                  message.content.split('\n').map((line, i) => (
                    <span key={i} className="block min-h-[1.25rem] font-medium">{line}</span>
                  ))
                ) : (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <div className="my-4 border-2 border-[#E2FF00] shadow-[2px_2px_0px_#E2FF00]">
                            <div className="bg-[#E2FF00] px-4 py-1.5 text-xs text-black font-mono font-bold uppercase tracking-wider flex items-center justify-between border-b-2 border-black">
                              <span>{match[1]}</span>
                            </div>
                            <SyntaxHighlighter
                              {...props}
                              style={vscDarkPlus}
                              language={match[1]}
                              PreTag="div"
                              className="!mt-0 !mb-0 !rounded-none !bg-black text-sm"
                              customStyle={{ margin: 0, padding: '1rem', background: '#000' }}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          </div>
                        ) : (
                          <code {...props} className="bg-[#E2FF00] text-black px-1.5 py-0.5 text-sm font-mono font-bold">
                            {children}
                          </code>
                        );
                      },
                      p: ({ children }) => <p className="mb-4 last:mb-0 leading-relaxed font-medium">{children}</p>,
                      ul: ({ children }) => <ul className="list-square pl-6 mb-4 space-y-2 font-medium marker:text-[#E2FF00]">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-2 font-medium marker:text-[#E2FF00] font-bold">{children}</ol>,
                      li: ({ children }) => <li className="pl-2">{children}</li>,
                      h1: ({ children }) => <h1 className="text-2xl font-black uppercase italic mb-4 mt-6 text-[#E2FF00] border-b-2 border-[#E2FF00] pb-2">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-xl font-black uppercase italic mb-3 mt-5 text-white">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-lg font-bold uppercase mb-2 mt-4 text-[#E2FF00]">{children}</h3>,
                      a: ({ children, href }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#E2FF00] hover:bg-[#E2FF00] hover:text-black font-bold underline underline-offset-4 transition-colors px-1">{children}</a>,
                      strong: ({ children }) => <strong className="font-black text-[#E2FF00] tracking-wide">{children}</strong>,
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4 flex-row animate-in fade-in duration-200">
              <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 border-2 border-white bg-black text-white">
                <Bot className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2 max-w-[80%] px-5 py-4 border-2 border-white bg-[#111111] shadow-[2px_2px_0px_#ffffff]">
                <span className="w-2.5 h-2.5 bg-[#E2FF00] animate-pulse" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2.5 h-2.5 bg-[#E2FF00] animate-pulse" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2.5 h-2.5 bg-[#E2FF00] animate-pulse" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area - Brutalist Box */}
        <footer className="w-full bg-black p-4 sm:p-6 md:p-8 z-10 border-t-2 border-white">
          <div className="max-w-4xl mx-auto w-full relative">
            <form
              onSubmit={handleSend}
              className="flex flex-col w-full bg-black border-2 border-white shadow-[2px_2px_0px_#E2FF00] focus-within:shadow-[4px_4px_0px_#E2FF00] transition-all duration-200"
            >
              <div className="flex w-full items-center p-1">
                <input
                  type="file"
                  hidden
                  accept=".pdf,.doc,.docx,.txt"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setAttachedFile(e.target.files[0]);
                    }
                  }}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-12 w-12 rounded-none text-white hover:text-black hover:bg-[#E2FF00] transition-colors shrink-0"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="w-5 h-5" />
                  <span className="sr-only">Attach file</span>
                </Button>
                <Input
                  type="text"
                  placeholder="ENTER COMMAND..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 rounded-none bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-gray-500 placeholder:font-bold placeholder:tracking-widest font-mono text-base px-2 h-12"
                  disabled={isLoading}
                  autoFocus
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={(!input.trim() && !attachedFile) || isLoading}
                  className="h-12 w-12 rounded-none bg-[#E2FF00] hover:bg-white text-black transition-colors disabled:opacity-50 shrink-0 border-l-2 border-white"
                >
                  <Send className="w-5 h-5" />
                  <span className="sr-only">Send message</span>
                </Button>
              </div>

              {attachedFile && (
                <div className="flex items-center justify-between bg-[#111111] border-t-2 border-white p-2">
                  <div className="flex items-center space-x-3 overflow-hidden pl-2">
                    <FileText className="w-4 h-4 text-[#E2FF00] shrink-0" />
                    <span className="text-sm text-white font-mono font-bold truncate">{attachedFile.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAttachedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="text-white hover:text-black hover:bg-[#E2FF00] transition-colors shrink-0 p-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </form>
          </div>
        </footer>

        {/* Brutalist scrollbar styles */}
        <style dangerouslySetInnerHTML={{
          __html: `
          .custom-scrollbar::-webkit-scrollbar {
            width: 12px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #000;
            border-left: 2px solid #333;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #E2FF00;
            border: 2px solid #000;
          }
          .custom-scrollbar:hover::-webkit-scrollbar-thumb {
            background-color: #fff;
          }
        `}} />
      </section>
    </main>
  );
}
