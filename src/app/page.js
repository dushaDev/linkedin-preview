"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { 
  Bold, Italic, Strikethrough, Underline, List, ListOrdered, Smile, Copy, Check, 
  Undo, Redo, ExternalLink, Info, Camera, RefreshCcw,
  ThumbsUp, MessageSquare, Repeat, Send, Globe, MoreHorizontal, X, Trash2
} from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { applyFormat, toggleBullet, toggleNumbering } from "@/utils/textFormatter";

export default function Home() {
  const [content, setContent] = useState("");
  const [history, setHistory] = useState([""]);
  const [historyStep, setHistoryStep] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  const [postImage, setPostImage] = useState(null);
  const [mobileTab, setMobileTab] = useState('edit'); // 'edit' or 'preview'

  const PROFILES = [
    {
      name: "kaveesha Jayawardhane",
      title: "Undergraduate Software Engineer | AI & Machine Learning Enthusiast",
      image: "/linkedin-preview/profile-female.png"
    },
    {
      name: "Kasun Mendis",
      title: "Full Stack Developer | UI/UX Designer | Open Source Contributor",
      image: "/linkedin-preview/profile-male.jpg"
    },
    {
      name: "Sarah Jenkins",
      title: "Senior Product Marketing Manager at GlobalTech",
      image: "/linkedin-preview/profile-female-1.jpg"
    },
    {
      name: "Michael Chen",
      title: "Data Scientist | Passionate about AI Ethics & Sustainability",
      image: "/linkedin-preview/profile-male-1.jpg"
    }
  ];

  const [profileIndex, setProfileIndex] = useState(0);
  const [reactionCount, setReactionCount] = useState(169);
  const [commentCount, setCommentCount] = useState(12);
  const [repostCount, setRepostCount] = useState(4);

  const randomizeProfile = () => {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * PROFILES.length);
    } while (nextIndex === profileIndex);
    
    setProfileIndex(nextIndex);
    setReactionCount(Math.floor(Math.random() * 450) + 50);
    setCommentCount(Math.floor(Math.random() * 40) + 5);
    setRepostCount(Math.floor(Math.random() * 15) + 1);
  };

  const currentProfile = PROFILES[profileIndex];

  const textareaRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
    // Force light theme
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    
    // Restore last edited content
    const savedContent = localStorage.getItem("lastEditedContent");
    if (savedContent) {
      setContent(savedContent);
      setHistory([savedContent]);
    }

    const savedImage = localStorage.getItem("lastEditedImage");
    if (savedImage) setPostImage(savedImage);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("lastEditedContent", content);
      if (postImage) localStorage.setItem("lastEditedImage", postImage);
      else localStorage.removeItem("lastEditedImage");
    }
  }, [content, postImage, isMounted]);

  const updateContent = (newContent, addToHistory = true) => {
    setContent(newContent);
    if (addToHistory && newContent !== history[historyStep]) {
      const newHistory = history.slice(0, historyStep + 1);
      newHistory.push(newContent);
      // Limit history to 50 steps
      if (newHistory.length > 50) newHistory.shift();
      setHistory(newHistory);
      setHistoryStep(newHistory.length - 1);
    }
  };

  const undo = () => {
    if (historyStep > 0) {
      const prevStep = historyStep - 1;
      setHistoryStep(prevStep);
      setContent(history[prevStep]);
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      const nextStep = historyStep + 1;
      setHistoryStep(nextStep);
      setContent(history[nextStep]);
    }
  };

  const handleFormat = (format) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    if (start === end && !['bullet', 'number', 'strikethrough', 'underline'].includes(format)) return;
    
    let startToUse = start;
    let endToUse = end;

    if (start === end && ['bullet', 'number'].includes(format)) {
      const textBefore = content.substring(0, start);
      const textAfter = content.substring(start);
      startToUse = textBefore.lastIndexOf('\n') === -1 ? 0 : textBefore.lastIndexOf('\n') + 1;
      endToUse = textAfter.indexOf('\n') === -1 ? content.length : start + textAfter.indexOf('\n');
    }

    const selectedText = content.substring(startToUse, endToUse);

    let newText = "";
    if (selectedText || ['bullet', 'number'].includes(format)) {
      if (format === 'bullet') newText = toggleBullet(selectedText || "");
      else if (format === 'number') newText = toggleNumbering(selectedText || "");
      else newText = applyFormat(selectedText, format);
      
      const newContent = content.substring(0, startToUse) + newText + content.substring(endToUse);
      
      const scrollContainer = scrollContainerRef.current;
      const savedScrollTop = scrollContainer ? scrollContainer.scrollTop : 0;
      
      updateContent(newContent);
      
      setTimeout(() => {
        if (scrollContainer) {
          scrollContainer.scrollTop = savedScrollTop;
        }
        textarea.focus();
        textarea.setSelectionRange(startToUse, startToUse + newText.length);
      }, 0);
    }
  };

  const copyToClipboard = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const onEmojiClick = (emojiObject) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const newContent = content.substring(0, start) + emojiObject.emoji + content.substring(end);
    updateContent(newContent);
    setShowEmojiPicker(false);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emojiObject.emoji.length, start + emojiObject.emoji.length);
    }, 0);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPostImage(null);
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center justify-between p-4 sm:p-8 transition-colors duration-300">
      
      {/* Header Info */}
      <div className="w-full max-w-7xl flex items-center justify-between mb-6 px-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 relative drop-shadow-sm group transition-transform hover:scale-105">
            <Image 
              src="/linkedin-preview/logo.png" 
              alt="Logo" 
              fill
              className="object-contain"
              priority
            />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight leading-tight">LinkedInPreview</h1>
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold opacity-80">Post Formatter</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowInfo(!showInfo)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 shadow-sm transition-all active:scale-95"
          >
            <Info size={18} className={showInfo ? "text-blue-500" : "text-zinc-500"} />
          </button>
        </div>
      </div>

      <div className="w-full max-w-7xl h-[85vh] md:h-[75vh] bg-white rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] overflow-visible border border-zinc-200 flex flex-col md:flex-row transition-all duration-300 relative z-10">
        
        {/* About Tool Overlay */}
        {showInfo && (
          <div className="absolute inset-0 bg-white/95 z-50 p-10 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300 rounded-[2.5rem] overflow-y-auto">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold mb-4">About LinkedInPreview</h2>
              <p className="text-zinc-600 mb-8 leading-relaxed">
                LinkedInPreview is a tool designed for professionals who want their content to stand out. 
                LinkedIn's actual post editor doesn't support bold, italics, or custom bullets. We use magic 
                Unicode characters that work anywhere—allowing you to style your posts while seeing exactly 
                how they will look on the feed.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                {[
                  { title: "Smart Formatting", desc: "Instantly convert text to Unicode formatting symbols." },
                  { title: "Native Emojis", desc: "Integrated picker for quick access to post variety." },
                  { title: "Live Feed Preview", desc: "Pixel-perfect recreation of the LinkedIn mobile feed." },
                  { title: "Copy & Go", desc: "One-click copy. Ready to paste directly into LinkedIn." }
                ].map((f, i) => (
                  <div key={i} className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                    <h3 className="font-bold text-sm mb-1">{f.title}</h3>
                    <p className="text-xs text-zinc-500">{f.desc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-3 bg-blue-50/30 rounded-xl border border-blue-100/50">
                <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest mb-2">Image Credits</p>
                <div className="flex justify-center gap-4 text-[11px] text-zinc-500 font-bold">
                  <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">pexels.com</a>
                  <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">unsplash.com</a>
                </div>
              </div>
              <button 
                onClick={() => setShowInfo(false)}
                className="mt-10 px-8 py-3 bg-zinc-900 text-white rounded-full font-bold transition-transform hover:scale-105"
              >
                Got it, let's write!
              </button>
            </div>
          </div>
        )}

        {/* Mobile Tabs */}
        <div className="md:hidden flex border-b border-zinc-100 w-full overflow-hidden rounded-t-[2.5rem] shrink-0">
          <button 
            onClick={() => setMobileTab('edit')} 
            className={`flex-1 py-3 text-sm font-bold transition-colors ${mobileTab === 'edit' ? 'bg-zinc-100 text-zinc-900 border-b-2 border-zinc-900' : 'bg-white text-zinc-500 hover:bg-zinc-50'}`}
          >
            Editor
          </button>
          <button 
            onClick={() => setMobileTab('preview')} 
            className={`flex-1 py-3 text-sm font-bold transition-colors ${mobileTab === 'preview' ? 'bg-zinc-100 text-zinc-900 border-b-2 border-zinc-900' : 'bg-white text-zinc-500 hover:bg-zinc-50'}`}
          >
            Preview
          </button>
        </div>

        {/* Editor Side */}
        <div className={`w-full md:w-1/2 h-full flex-col border-b md:border-b-0 md:border-r border-zinc-100 bg-white overflow-visible relative ${mobileTab === 'edit' ? 'flex' : 'hidden md:flex'} rounded-bl-[2.5rem] md:rounded-l-[2.5rem]`}>
          <div className="h-16 border-b border-zinc-100 flex items-center justify-between px-4 md:px-6 bg-zinc-50/30 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <button 
                onClick={undo} 
                disabled={historyStep <= 0} 
                className="p-2 rounded-lg bg-zinc-100/80 border border-zinc-200/50 shadow-sm text-zinc-600 disabled:opacity-30 disabled:bg-transparent disabled:border-transparent transition-all hover:bg-zinc-200 hover:text-zinc-900 hover:scale-105 active:scale-95" 
                title="Undo"
              >
                <Undo size={16} />
              </button>
              <button 
                onClick={redo} 
                disabled={historyStep >= history.length - 1} 
                className="p-2 rounded-lg bg-zinc-100/80 border border-zinc-200/50 shadow-sm text-zinc-600 disabled:opacity-30 disabled:bg-transparent disabled:border-transparent transition-all hover:bg-zinc-200 hover:text-zinc-900 hover:scale-105 active:scale-95" 
                title="Redo"
              >
                <Redo size={16} />
              </button>
            </div>
            <div className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-tighter transition-all flex items-center gap-2 ${content.length > 3000 ? 'bg-red-500 text-white animate-pulse' : content.length > 2800 ? 'bg-amber-100 text-amber-700' : 'bg-blue-50 text-blue-600'}`}>
              <span className="opacity-60 uppercase font-bold italic">Characters:</span> {content.length} / 3000
              {content.length > 3000 && (
                <div className="flex items-center gap-1 border-l border-white/20 pl-2">
                  <X size={10} /> 
                  <span>LinkedIn limit exceeded (max 3000)</span>
                </div>
              )}
            </div>
          </div>
          
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto custom-scrollbar relative p-4 md:p-8">
            <div className="grid grid-cols-1 w-full min-h-full">
              {/* Ghost element to reserve space - perfectly mirrors textarea typography */}
              <div 
                className="invisible whitespace-pre-wrap wrap-break-word text-[18px] leading-[1.6] pointer-events-none"
                aria-hidden="true"
                style={{ gridArea: '1 / 1 / 2 / 2' }}
              >
                {content + (content.endsWith('\n') ? ' ' : '\n')}
              </div>
              
              <textarea
                ref={textareaRef}
                className="w-full bg-transparent resize-none outline-none text-zinc-800 placeholder:text-zinc-300 text-[18px] leading-[1.6] transition-colors p-0 overflow-hidden"
                style={{ gridArea: '1 / 1 / 2 / 2' }}
                placeholder="Start typing your masterpiece...&#10;&#10;Select some text and try formatting it!"
                value={content}
                onChange={(e) => updateContent(e.target.value)}
              />
            </div>
          </div>

          {showEmojiPicker && (
            <div className="absolute bottom-20 left-4 md:left-8 shadow-2xl z-50 rounded-2xl overflow-hidden border border-zinc-200 animate-in fade-in slide-in-from-bottom-4">
              <EmojiPicker onEmojiClick={onEmojiClick} theme="light" lazyLoadEmojis={true} autoFocusSearch={false} width={320} height={400} />
            </div>
          )}
          
          {/* Formatting Toolbar */}
          <div onMouseDown={(e) => e.preventDefault()} className="px-4 py-3 md:px-6 md:py-4 border-t border-zinc-100 bg-white/80 flex flex-wrap md:flex-nowrap items-center justify-between gap-3 backdrop-blur-md">
            <div className="flex items-center gap-0.5 md:gap-1 flex-wrap">
              <button onClick={() => handleFormat('bold')} className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl hover:bg-zinc-100 text-zinc-600 transition-all active:scale-90" title="Bold">
                <Bold size={18} />
              </button>
              <button onClick={() => handleFormat('italic')} className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl hover:bg-zinc-100 text-zinc-600 transition-all active:scale-90" title="Italic">
                <Italic size={18} />
              </button>
              <button onClick={() => handleFormat('strikethrough')} className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl hover:bg-zinc-100 text-zinc-600 transition-all active:scale-90" title="Strikethrough">
                <Strikethrough size={18} />
              </button>
              <button onClick={() => handleFormat('underline')} className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl hover:bg-zinc-100 text-zinc-600 transition-all active:scale-90" title="Underline">
                <Underline size={18} />
              </button>
              <div className="w-px h-6 bg-zinc-200 mx-1 md:mx-2"></div>
              <button onClick={() => handleFormat('bullet')} className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl hover:bg-zinc-100 text-zinc-600 transition-all active:scale-90" title="Bullet Points">
                <List size={18} />
              </button>
              <button onClick={() => handleFormat('number')} className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl hover:bg-zinc-100 text-zinc-600 transition-all active:scale-90" title="Numbering">
                <ListOrdered size={18} />
              </button>
              
              <div className="w-px h-6 bg-zinc-200 mx-1 md:mx-2"></div>
              
              <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className={`w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl transition-all active:scale-90 ${showEmojiPicker ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'hover:bg-zinc-100 text-zinc-600'}`} title="Emoji Picker">
                <Smile size={18} />
              </button>
              
              <label className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl hover:bg-zinc-100 text-zinc-600 transition-all active:scale-90 cursor-pointer" title="Add Image">
                <Camera size={18} />
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>
            <button 
              onClick={copyToClipboard}
              className={`px-4 py-2 flex items-center gap-2 text-white text-xs font-bold rounded-lg shadow-lg transition-all active:scale-95 shrink-0 ${copied ? 'bg-green-600 shadow-green-500/20' : 'bg-zinc-700 shadow-zinc-900/10 hover:shadow-zinc-900/20 hover:-translate-y-0.5'}`}
            >
              {copied ? <Check size={14}/> : <Copy size={14}/>}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Preview Side */}
        <div className={`w-full md:w-1/2 h-full bg-[#f3f2ef] overflow-y-auto flex-col items-center py-6 px-4 sm:px-8 relative custom-scrollbar border-l border-zinc-100 ${mobileTab === 'preview' ? 'flex' : 'hidden md:flex'} rounded-br-[2.5rem] md:rounded-r-[2.5rem]`}>
           
           {/* Controls Bar Above Post */}
           <div className="w-full max-w-[550px] mb-4 flex justify-end px-1">
             <button 
                onClick={randomizeProfile}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-zinc-600 text-[11px] font-bold transition-all shadow-sm hover:bg-zinc-50 active:scale-95 group uppercase tracking-tight"
              >
                 <RefreshCcw size={14} className="group-active:rotate-180 transition-transform duration-500 text-zinc-400" />
                Shuffle Profile
              </button>
           </div>

           {/* Authentic LinkedIn Post Wrapper */}
           {/* Authentic LinkedIn Post Wrapper */}
           <div className="w-full max-w-[550px] bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.1)] flex flex-col mb-4 transition-all duration-300">
              
              {/* Header */}
              <div className="flex justify-between items-start p-3 pb-2">
                <div className="flex gap-2">
                  <div className="w-12 h-12 rounded-full border border-black/5 overflow-hidden shrink-0 relative">
                    <Image 
                      src={currentProfile.image} 
                      alt="Avatar" 
                      fill
                      className="object-cover transition-all duration-500"
                      priority
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 group">
                        <span className="font-bold text-[14px] text-zinc-900 leading-tight hover:underline hover:text-blue-600 cursor-pointer transition-colors">{currentProfile.name}</span>
                        <span className="text-zinc-500 text-[13px] leading-tight">• 2nd</span>
                      </div>
                    </div>
                    <span className="text-[12px] text-zinc-500 leading-tight mt-0.5 line-clamp-1 max-w-[280px]">{currentProfile.title}</span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-[12px] text-zinc-500 leading-tight">2h • </span>
                      <div className="w-3 h-3 relative">
                        <Image src="/linkedin-preview/public.svg" alt="Public" fill className="object-contain opacity-60" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-2 rounded-full hover:bg-zinc-100 text-zinc-500 transition-colors">
                    <MoreHorizontal size={20} />
                  </button>
                  <button className="p-2 rounded-full hover:bg-zinc-100 text-zinc-500 transition-colors">
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Text Body */}
              <div className="px-3 pb-3 text-[14px] leading-normal text-zinc-800 whitespace-pre-wrap break-words font-sans">
                {content ? (
                  <>
                    {!isPreviewExpanded && content.length > 200 ? content.slice(0, 200) : content}
                    {!isPreviewExpanded && content.length > 200 && (
                      <button 
                        onClick={() => setIsPreviewExpanded(true)}
                        className="text-zinc-500 font-bold ml-1 hover:text-blue-600 hover:underline focus:outline-none"
                      >
                        ... more
                      </button>
                    )}
                  </>
                ) : (
                  <span className="text-zinc-400 italic">Preview your post here...</span>
                )}
              </div>

              {/* Post Image Render */}
              {postImage && (
                <div className="mb-2 relative group">
                  <div className="w-full aspect-video sm:aspect-[1.91/1] relative overflow-hidden bg-zinc-50 border-y border-zinc-100">
                    <Image 
                      src={postImage} 
                      alt="Post content" 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  <button 
                    onClick={removeImage}
                    className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 z-10"
                    title="Remove Image"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
              
              {/* Reactions Bar */}
              <div className="px-3 py-2 flex items-center justify-between mx-1">
                <div className="flex items-center">
                  <div className="flex items-center -space-x-1.5 mr-2">
                    {[
                      { src: '/linkedin-preview/react-like.svg', alt: 'Like' },
                      { src: '/linkedin-preview/react-insightful.svg', alt: 'Insightful' },
                      { src: '/linkedin-preview/react-love.svg', alt: 'Love' }
                    ].map((reaction, i) => (
                      <div key={i} className={`w-[18px] h-[18px] relative rounded-full border border-white z-${3-i} overflow-hidden bg-white`}>
                        <Image 
                          src={reaction.src} 
                          alt={reaction.alt} 
                          fill
                          className="object-contain"
                        />
                      </div>
                    ))}
                  </div>
                  <span className="text-[12px] text-[#0A66C2] font-medium hover:underline cursor-pointer">You and {reactionCount} others</span>
                </div>
                <div className="flex items-center gap-3 text-[12px] text-zinc-500 font-normal">
                  <span className="hover:text-[#0A66C2] hover:underline cursor-pointer">{commentCount} comments</span>
                  <span className="w-1 h-1 bg-zinc-300 rounded-full"></span>
                  <span className="hover:text-[#0A66C2] hover:underline cursor-pointer">{repostCount} reposts</span>
                </div>
              </div>

              {/* Interaction Bar (Icons Match LinkedIn Mobile) */}
              <div className="px-1 border-t border-zinc-100 mt-1 flex items-center justify-around">
                {[
                  { label: 'Like', icon: '/linkedin-preview/like.svg' },
                  { label: 'Comment', icon: '/linkedin-preview/comments.svg' },
                  { label: 'Repost', icon: '/linkedin-preview/repost.svg' },
                  { label: 'Send', icon: '/linkedin-preview/share.svg' }
                ].map((action) => (
                  <button key={action.label} className="flex-1 py-3 group flex flex-row items-center justify-center gap-2 rounded transition-colors hover:bg-zinc-100">
                    <div className="w-[18px] h-[18px] relative opacity-60 group-hover:opacity-100 transition-opacity">
                      <Image 
                        src={action.icon} 
                        alt={action.label}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-[12px] font-semibold text-zinc-600 group-hover:text-[#0A66C2] uppercase tracking-tighter">{action.label}</span>
                  </button>
                ))}
              </div>

              {/* Impressions Row */}
              <div className="px-3 py-2 border-t border-zinc-50 flex items-center justify-between mx-1 group cursor-pointer hover:bg-zinc-50 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 relative">
                    <Image src="/linkedin-preview/impression.svg" alt="Impressions" fill className="object-contain opacity-70" />
                  </div>
                  <span className="text-[12px] text-zinc-500 font-medium">303 impressions</span>
                </div>
                <div className="text-[13px] text-[#0A66C2] font-bold hover:underline">
                  View analytics
                </div>
              </div>

           </div>

           {/* Quick Tips */}
           <div className="w-full max-w-[550px] p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
              <h4 className="text-[12px] font-extrabold text-blue-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Smile size={14} /> Did you know?
              </h4>
              <p className="text-[13px] text-zinc-600 leading-relaxed font-medium">
                Posts with formatting highlights and images see <span className="font-extrabold text-zinc-900 underline decoration-blue-500/30">45% more engagement</span> on average. Stand out from the crowd!
              </p>
           </div>
           
           {/* Space at bottom for scrolling */}
           <div className="h-20 w-full shrink-0"></div>
        </div>

      </div>

      {/* Footer Branding */}
      <footer className="mt-8 mb-4 flex flex-col items-center gap-2 group">
        <p className="text-[12px] font-bold text-zinc-400 tracking-tighter uppercase transition-colors group-hover:text-zinc-600 flex items-center gap-2">
          Developed by 
          <a href="https://dushadev.github.io/" target="_blank" rel="noopener noreferrer" className="text-zinc-900 hover:text-blue-600 hover:underline flex items-center gap-0.5">
            DushaDev <ExternalLink size={10} />
          </a>
        </p>
      </footer>
    </div>
  );
}
