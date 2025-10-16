"use client";

import { useState, useRef, useEffect, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Send, Upload } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ApiResponse {
  answer: string;
  error?: string;
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file || !question.trim()) {
      alert("Please upload a CSV and enter a question.");
      return;
    }

    const newUserMessage: Message = { role: "user", content: question };
    setMessages((prev) => [...prev, newUserMessage]);
    setQuestion("");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("question", question);

    try {
      const res = await fetch("/api/ask", { method: "POST", body: formData });
      const data: ApiResponse = await res.json();

      const newAIMessage: Message = {
        role: "assistant",
        content: data.answer || "⚠️ Something went wrong.",
      };

      setMessages((prev) => [...prev, newAIMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Failed to get a response from AI, Please try to keep the file size under 1MB" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full flex-1 bg-background border-l rounded-lg shadow-lg overflow-hidden">


      {/* Header */}
      <div className="border-b p-4 text-center font-semibold text-lg text-foreground shadow-sm flex items-center justify-center gap-1 flex-col">
        <div className="flex gap-2">
          <img src="/icon.png" alt="" className="h-7 w-7 rounded-full" />
          <p>CruxAI (Beta)</p>
        </div>
      </div>

      {/* Chat Area */}
      <ScrollArea className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-6">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <Avatar className="mr-3">
                  <AvatarFallback><img src="/icon.png" alt="" /></AvatarFallback>
                </Avatar>
              )}

              <div
                className={`max-w-[75%] p-3 rounded-2xl text-sm shadow-sm ${msg.role === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-muted text-foreground rounded-bl-none"
                  } break-words whitespace-pre-wrap overflow-x-auto`}
              >
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>

              {msg.role === "user" && (
                <Avatar className="ml-3">
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex justify-start items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Thinking...
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

      </ScrollArea>

      {/* Input Area */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t bg-background flex flex-col gap-3"
      >
        <div className="flex items-center gap-3">
          {/* Upload Button */}
          <label
            htmlFor="file"
            className="flex items-center gap-2 border rounded-md px-3 py-2 cursor-pointer hover:bg-muted transition"
          >
            <Upload className="h-4 w-4" />
            <span className="text-sm">{file ? file.name : "Upload CSV"}</span>
          </label>
          <Input
            id="file"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Model Drawer */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs font-medium">
                Model: llama-3.1-8b-instant
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetHeader>
                <SheetTitle>Model Info</SheetTitle>
                <SheetDescription>
                  <div className="mt-2 space-y-3 text-sm">
                    <p><strong>Model:</strong> llama-3.1-8b-instant</p>
                    <p><strong>Provider:</strong> Groq / Meta Llama</p>
                    <p><strong>Context Length:</strong> 8k tokens</p>
                    <p><strong>Speed:</strong> Optimized for instant responses ⚡</p>
                  </div>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>


        <div className="flex items-end gap-3">
          <Textarea
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
              const target = e.target;
              target.style.height = "auto";
              target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
            }}
            placeholder="Ask about your CSV..."
            className="flex-1 resize-none overflow-y-auto min-h-[60px] max-h-[200px] transition-[height] duration-200 ease-in-out"
          />
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-xs font-thin text-center">We are in beta testing right now, CruxAI can make mistakes.</p>
      </form>
      
    </div>
  );
}
