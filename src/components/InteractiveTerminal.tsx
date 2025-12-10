"use client";

import { useState, useRef, useEffect } from "react";

// Define the available commands and their responses
const COMMANDS = {
  help: [
    "Available commands:",
    "about      - Show about info",
    "skills     - List skills",
    "projects   - List projects",
    "contact    - Show contact info",
    "clear      - Clear terminal",
    "sudo       - Try it :)",
    "hack       - Simulate a hacking attempt",
    "matrix     - Show matrix effect",
    "banner     - Display ASCII art banner",
    "help       - Show this help message"
  ],
  about: [
    "Hi, I'm Aditya Kumar Tiwari, a passionate Cybersecurity Specialist and Full-Stack Developer.",
    "Currently pursuing a BCA in Cybersecurity at Sushant University.",
    "I specialize in Python, JavaScript, Linux, and Cloud Computing."
  ],
  skills: [
    "⚙️ Penetration Testing [██████████] 90%",
    "⚙️ React/Next.js      [█████████ ] 85%",
    "⚙️ Node.js            [████████  ] 80%",
    "⚙️ Python             [███████   ] 75%",
    "⚙️ Network Security   [████████  ] 80%",
    "⚙️ Linux              [███████   ] 70%",
    "⚙️ Reverse Engineering[██████    ] 60%",
    "⚙️ Cloud Security     [██████▌   ] 65%"
  ],
  projects: [
    "Recent projects:",
    "1. Flappy - A 2D game built using HTML, CSS, and JavaScript",
    "2. Cinesphere - A movie website with high-rated free movies",
    "3. Innova - Modern responsive e-commerce website",
    "4. SEO Optimized Website - Improved search engine visibility",
    "5. MovieVerse Explorer - Movie exploration with dynamic API content",
    "Type 'project [number]' for details about a specific project."
  ],
  contact: [
    "Email: aditya@email.com",
    "LinkedIn: linkedin.com/in/aditya",
    "GitHub: github.com/aditya"
  ],
  sudo: [
    "Permission denied: You are not root.",
    "Just kidding! Here's an Easter egg: 👾 Stay curious, stay secure! 👾"
  ],
  hack: [
    "INITIATING HACK SEQUENCE...",
    "Accessing mainframe...",
    "Bypassing security protocols...",
    "Decrypting files...",
    "Downloading data...",
    "HACK COMPLETE!",
    "Just kidding! This is a simulation. No systems were harmed during this demo."
  ],
  banner: [
    "  _____    _ _ _                 ",
    " |  __ \\  | (_) |                ",
    " | |  | | | |_| |_ _   _  __ _  ",
    " | |  | | | | | __| | | |/ _` | ",
    " | |__| | | | | |_| |_| | (_| | ",
    " |_____/  |_|_|\\__|\\__, |\\__,_| ",
    "                    __/ |       ",
    "                   |___/        ",
    "                               ",
    "Cybersecurity Specialist & Developer"
  ]
};

// Project details
const PROJECT_DETAILS: { [key: string]: string[] } = {
  "1": [
    "Project: Flappy",
    "Tech Stack: HTML, CSS, JavaScript",
    "Description: A fun 2D game built for game enthusiasts",
    "Features: Character customization, score tracking, responsive design"
  ],
  "2": [
    "Project: Movie Website (Cinesphere)",
    "Tech Stack: React, Node.js, MovieDB API",
    "Description: A platform for accessing high-rated movies",
    "Features: Search functionality, movie recommendations, watchlist creation"
  ],
  "3": [
    "Project: Innova",
    "Tech Stack: Next.js, MongoDB, Stripe",
    "Description: Modern e-commerce platform with seamless UX",
    "Features: Product filtering, secure checkout, order tracking"
  ],
  "4": [
    "Project: SEO Optimized Website",
    "Tech Stack: React, Next.js, Schema markup",
    "Description: Website built with best SEO practices",
    "Features: Fast load times, semantic HTML, optimized meta tags"
  ],
  "5": [
    "Project: MovieVerse Explorer",
    "Tech Stack: React, Redux, TMDB API",
    "Description: Dynamic movie exploration site with API integration",
    "Features: Real-time data fetching, movie details, trailer viewing"
  ]
};

// Function to create typewriter effect
function typewriterEffect(lines: string[], cb: (line: string) => void, done: () => void) {
  let i = 0;
  function nextLine() {
    if (i < lines.length) {
      let j = 0;
      let current = "";
      function typeChar() {
        if (j < lines[i].length) {
          current += lines[i][j];
          cb(current + (j % 2 === 0 ? "_" : ""));
          j++;
          setTimeout(typeChar, 12 + Math.random() * 30);
        } else {
          cb(lines[i]);
          i++;
          setTimeout(nextLine, 200);
        }
      }
      typeChar();
    } else {
      done();
    }
  }
  nextLine();
}

// Matrix effect for the terminal
function MatrixEffect({ done }: { done: () => void }) {
  const [text, setText] = useState<string[]>([]);
  
  useEffect(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,./<>?";
    const lines = 15;
    const width = 40;
    let currentLines: string[] = [];
    
    for (let i = 0; i < lines; i++) {
      let line = "";
      for (let j = 0; j < width; j++) {
        line += chars[Math.floor(Math.random() * chars.length)];
      }
      currentLines.push(line);
    }
    
    setText(currentLines);
    
    let count = 0;
    const interval = setInterval(() => {
      for (let i = 0; i < lines; i++) {
        let line = "";
        for (let j = 0; j < width; j++) {
          line += chars[Math.floor(Math.random() * chars.length)];
        }
        currentLines[i] = line;
      }
      
      setText([...currentLines]);
      count++;
      
      if (count > 10) {
        clearInterval(interval);
        setTimeout(done, 500);
      }
    }, 150);
    
    return () => clearInterval(interval);
  }, [done]);
  
  return (
    <div className="font-mono text-green-400 overflow-hidden whitespace-nowrap">
      {text.map((line, i) => (
        <div key={i} className="text-xs">{line}</div>
      ))}
    </div>
  );
}

export default function InteractiveTerminal() {
  const [history, setHistory] = useState<string[]>([
    "Welcome to 0xAditya's Terminal Portfolio!",
    "Type 'help' to see available commands or try 'banner'."
  ]);
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  const showPrompt = !showMatrix && !isTyping;

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [history, isTyping]);

  function handleCommand(cmd: string) {
    const trimmedCmd = cmd.trim().toLowerCase();
    if (!trimmedCmd) return;
    
    // Add command to history
    setHistory((h) => [...h, `0xAditya@portfolio:~$ ${cmd}`]);
    
    // Handle clear command
    if (trimmedCmd === "clear") {
      setHistory([]);
      return;
    }
    
    // Handle matrix command
    if (trimmedCmd === "matrix") {
      setShowMatrix(true);
      setTimeout(() => {
        setShowMatrix(false);
        setHistory((h) => [
          ...h, 
          "Matrix sequence completed. System normal."
        ]);
      }, 2000);
      return;
    }
    
    // Handle project details command
    if (trimmedCmd.startsWith("project ")) {
      const projectNum = trimmedCmd.split(" ")[1];
      if (PROJECT_DETAILS[projectNum]) {
        setIsTyping(true);
        typewriterEffect(
          PROJECT_DETAILS[projectNum], 
          (line) => {
            setHistory((h) => [...h.slice(0, h.length), line]);
          },
          () => setIsTyping(false)
        );
      } else {
        setHistory((h) => [
          ...h,
          `Project ${projectNum} not found. Try 'projects' to see available projects.`
        ]);
      }
      return;
    }
    
    // Handle standard commands
    if (COMMANDS[trimmedCmd as keyof typeof COMMANDS]) {
      setIsTyping(true);
      let lines: string[] = COMMANDS[trimmedCmd as keyof typeof COMMANDS];
      
      typewriterEffect(
        lines,
        (line) => {
          setHistory((h) => [...h.slice(0, h.length - 1), line]);
        },
        () => setIsTyping(false)
      );
      
      // Add first line immediately to avoid UI jump
      setHistory((h) => [...h, lines[0] || ""]);
    } else {
      setHistory((h) => [
        ...h,
        `Command not found: ${cmd}. Type 'help' for a list of commands.`
      ]);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !isTyping && !showMatrix) {
      handleCommand(input);
      setInput("");
    }
  }

  return (
    <div
      className="w-full max-w-2xl mx-auto bg-black/90 border-2 border-[#39ff14] rounded-xl shadow-2xl p-4 font-mono text-[#39ff14] relative overflow-hidden terminal-card"
      onClick={() => inputRef.current?.focus()}
      tabIndex={0}
      style={{ minHeight: "300px" }}
    >
      {/* Terminal window decorations */}
      <div className="flex items-center justify-between mb-3 border-b border-[#39ff14]/30 pb-2">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="text-xs text-center flex-grow text-green-300">0xAditya@terminal:~</div>
        <div className="text-xs">bash</div>
<div className="flex space-x-2 ml-4">
  <button
    className="px-2 py-0.5 bg-[#222] border border-[#39ff14] rounded text-xs text-[#39ff14] hover:bg-[#39ff14] hover:text-black transition"
    title="Cut last line"
    onClick={e => {
      e.stopPropagation();
      if (history.length > 0) {
        const last = history[history.length - 1];
        navigator.clipboard.writeText(last);
        setHistory(h => h.slice(0, h.length - 1));
      }
    }}
    tabIndex={-1}
  >Cut</button>
  <button
    className="px-2 py-0.5 bg-[#222] border border-[#39ff14] rounded text-xs text-[#39ff14] hover:bg-[#39ff14] hover:text-black transition"
    title="Copy all"
    onClick={e => {
      e.stopPropagation();
      if (history.length > 0) {
        navigator.clipboard.writeText(history.join("\n"));
      }
    }}
    tabIndex={-1}
  >Copy</button>
  <button
    className="px-2 py-0.5 bg-[#222] border border-[#39ff14] rounded text-xs text-[#39ff14] hover:bg-[#39ff14] hover:text-black transition"
    title="Clear terminal"
    onClick={e => {
      e.stopPropagation();
      setHistory([]);
    }}
    tabIndex={-1}
  >Clear</button>
</div>
      </div>
      
      <div
        ref={historyRef}
        className="overflow-y-auto max-h-60 mb-2 pr-1 terminal-history"
        style={{ scrollbarColor: "#39ff14 #111" }}
      >
        {showMatrix ? (
          <MatrixEffect done={() => setShowMatrix(false)} />
        ) : (
          history.map((line, i) => (
            <div key={i} className="whitespace-pre-line text-xs sm:text-sm terminal-line">
              {line}
            </div>
          ))
        )}
      </div>
      
      {showPrompt && (
        <div className="flex items-center text-xs sm:text-sm">
          <span className="text-cyan-400">0xAditya@portfolio:</span>
          <span className="text-magenta-400 ml-1">~</span>
          <span className="text-green-400 ml-1">$</span>
          <input
            ref={inputRef}
            className="bg-transparent border-none outline-none text-[#39ff14] ml-2 flex-1 caret-green-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            autoFocus
            spellCheck={false}
            aria-label="Terminal command input"
          />
          <span className={`ml-1 animate-blink ${isFocused ? "opacity-100" : "opacity-50"}`}>█</span>
        </div>
      )}
      
      <style jsx>{`
        .terminal-history {
          min-height: 200px;
        }
        
        .terminal-line {
          line-height: 1.4;
        }
        
        .animate-blink {
          animation: blink 1s steps(2, start) infinite;
        }
        
        @keyframes blink {
          to { opacity: 0; }
        }
        
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #0a0a0a;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #39ff14;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
