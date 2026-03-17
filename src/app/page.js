"use client";

import { useState, useRef, useEffect } from "react";
import { Bold, Italic, List, Smile, Copy, Check } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { applyFormat, toggleBullet } from "@/utils/textFormatter";

export default function Home() {
  const [content, setContent] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleFormat = (format) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    // If no text is selected for bullet, apply to the current line if possible, or entire text.
    // For simplicity, if no text selected, we just don't format bold/italic.
    if (start === end && format !== 'bullet') return;
    
    let startToUse = start;
    let endToUse = end;

    if (start === end && format === 'bullet') {
      // Find current line bounds
      const textBefore = content.substring(0, start);
      const textAfter = content.substring(start);
      startToUse = textBefore.lastIndexOf('\n') === -1 ? 0 : textBefore.lastIndexOf('\n') + 1;
      endToUse = textAfter.indexOf('\n') === -1 ? content.length : start + textAfter.indexOf('\n');
    }

    const selectedText = content.substring(startToUse, endToUse);

    let newText = "";
    if (selectedText || format === 'bullet') {
      if (format === 'bullet') {
        newText = toggleBullet(selectedText || "");
      } else {
        newText = applyFormat(selectedText, format);
      }
      
      const newContent = content.substring(0, startToUse) + newText + content.substring(endToUse);
      setContent(newContent);
      
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(startToUse, startToUse + newText.length);
      }, 0);
    }
  };

  const onEmojiClick = (emojiObject) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const newContent = content.substring(0, start) + emojiObject.emoji + content.substring(end);
    setContent(newContent);
    setShowEmojiPicker(false);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emojiObject.emoji.length, start + emojiObject.emoji.length);
    }, 0);
  };

  const copyToClipboard = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isMounted) return null; // Avoid hydration mismatch

  return (
    <div className="min-h-screen bg-[#f3f2ef] dark:bg-zinc-950 flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <div className="w-full max-w-7xl h-[85vh] bg-white dark:bg-zinc-900 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] overflow-visible border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row transition-all duration-300 relative z-10">
        
        {/* Editor Side */}
        <div className="w-full md:w-1/2 h-full flex flex-col border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-visible relative">
          <div className="h-16 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-6 bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-sm">
            <h2 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 tracking-wider uppercase">InScribe Editor</h2>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${content.length > 2900 ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'}`}>
              {content.length} <span className="opacity-60 font-normal">/ 3000</span>
            </div>
          </div>
          
          <div className="flex-1 p-6 flex flex-col overflow-y-auto relative">
            <textarea
              ref={textareaRef}
              className="flex-1 w-full bg-transparent resize-none outline-none text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-300 dark:placeholder:text-zinc-600 text-[17px] leading-[1.6] transition-colors"
              placeholder="What do you want to talk about?&#10;&#10;Try typing something, select the text, and make it BOLD using the toolbar below!"
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, 3000))}
              autoFocus
            />

            {showEmojiPicker && (
              <div className="absolute bottom-2 left-6 shadow-2xl z-50 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 animate-in fade-in slide-in-from-bottom-2">
                <EmojiPicker onEmojiClick={onEmojiClick} theme="auto" lazyLoadEmojis={true} autoFocusSearch={false} />
              </div>
            )}
          </div>
          
          {/* Formatting Toolbar */}
          <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button onClick={() => handleFormat('bold')} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-all" title="Bold (Select Text First)">
                <Bold size={18} />
              </button>
              <button onClick={() => handleFormat('italic')} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-all" title="Italic (Select Text First)">
                <Italic size={18} />
              </button>
              <div className="w-px h-5 bg-zinc-300 dark:bg-zinc-700 mx-2"></div>
              <button onClick={() => handleFormat('bullet')} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-all" title="Bullet List">
                <List size={18} />
              </button>
              <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${showEmojiPicker ? 'bg-zinc-200 dark:bg-zinc-700' : 'hover:bg-zinc-200 dark:hover:bg-zinc-800'} text-zinc-600 dark:text-zinc-300`} title="Emoji">
                <Smile size={18} />
              </button>
            </div>
            <button 
              onClick={copyToClipboard}
              className={`px-5 py-2 flex items-center gap-2 text-white text-sm font-semibold rounded-full shadow-md transition-all active:scale-95 ${copied ? 'bg-green-600 hover:bg-green-700 shadow-green-500/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40'}`}
            >
              {copied ? <><Check size={16}/> Copied!</> : <><Copy size={16}/> Copy Text</>}
            </button>
          </div>
        </div>

        {/* Preview Side */}
        <div className="w-full md:w-1/2 h-[85vh] bg-[#f3f2ef] dark:bg-[#000000] overflow-y-auto hidden md:flex flex-col items-center py-10 px-4 relative custom-scrollbar">
           
           {/* Mobile wrapper for authentic feel */}
           <div className="w-full max-w-[500px] bg-white dark:bg-[#1b1f23] rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] dark:shadow-none dark:border dark:border-zinc-800 flex flex-col mt-4">
              
              {/* LinkedIn Post Header */}
              <div className="flex items-center gap-3 p-4">
                <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden shrink-0">
                  <div className="w-full h-full bg-gradient-to-tr from-blue-100 to-blue-50 dark:from-zinc-700 dark:to-zinc-600"></div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-[15px] text-zinc-900 dark:text-zinc-100 leading-tight">Your Name</span>
                    <span className="text-zinc-500 dark:text-zinc-400 text-xs">• 1st</span>
                  </div>
                  <span className="text-[12px] text-zinc-500 dark:text-zinc-400 leading-tight">Software Engineer | Content Creator</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-[12px] text-zinc-500 dark:text-zinc-400 leading-tight">Just now • </span>
                    <svg className="w-3 h-3 text-zinc-500 dark:text-zinc-400 fill-current" viewBox="0 0 16 16"><path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 13a6 6 0 110-12 6 6 0 010 12zM5 8a1 1 0 11-2 0 1 1 0 012 0zm4 0a1 1 0 11-2 0 1 1 0 012 0zm4 0a1 1 0 11-2 0 1 1 0 012 0z"/></svg>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="px-4 pb-2 text-[14px] leading-[1.5] text-zinc-900 dark:text-zinc-800 whitespace-pre-wrap break-words dark:text-[#E9E9E9]">
                {content || <span className="text-zinc-400 dark:text-zinc-500 italic">Start typing to see your LinkedIn post preview here...</span>}
              </div>
              
              {/* Post Footer (Likes/Comments stats) */}
              <div className="px-4 py-2 mt-4 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/80">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white fill-current" viewBox="0 0 16 16"><path d="M12.42 4A3.66 3.66 0 009.5 2.5a3.66 3.66 0 00-2.92 1.5 3.66 3.66 0 00-2.92-1.5A3.66 3.66 0 000 6.16C0 10.5 8 15 8 15s8-4.5 8-8.84A3.66 3.66 0 0012.42 4z"/></svg>
                  </div>
                  <span className="text-[12px] text-zinc-500 dark:text-zinc-400 hover:text-blue-600 hover:underline cursor-pointer">42</span>
                </div>
                <div className="flex items-center gap-2 text-[12px] text-zinc-500 dark:text-zinc-400">
                  <span className="hover:text-blue-600 hover:underline cursor-pointer">12 comments</span>
                  <span>•</span>
                  <span className="hover:text-blue-600 hover:underline cursor-pointer">5 reposts</span>
                </div>
              </div>

              {/* Actions */}
              <div className="px-2 py-1 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/80">
                {['Like', 'Comment', 'Repost', 'Send'].map((action) => (
                  <button key={action} className="flex-1 py-3 flex items-center justify-center gap-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 transition-colors">
                    <span className="text-[14px] font-semibold">{action}</span>
                  </button>
                ))}
              </div>

           </div>
           
           {/* Space at bottom for scrolling */}
           <div className="h-20 w-full shrink-0"></div>
        </div>

      </div>
    </div>
  );
}
