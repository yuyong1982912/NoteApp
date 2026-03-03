/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  MoreHorizontal, 
  Image as ImageIcon, 
  ArrowLeft, 
  Save,
  Tag,
  Clock,
  Trash2,
  Edit3,
  Search,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

type TagType = string;

interface Note {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  date: string;
  tag?: TagType;
  imageUrl?: string;
  isFavorite?: boolean;
}

// --- Sample Data ---

const INITIAL_NOTES: Note[] = [
  {
    id: '1',
    title: 'Project Brainstorming',
    content: 'The new UI design should focus on accessibility and minimalism. Use a muted color palette with a single primary accent...',
    timestamp: '10:30 AM',
    date: 'Oct 24, 2023',
    tag: 'Design',
    imageUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: '2',
    title: 'Grocery List',
    content: 'Milk, Eggs, Flour, Coffee beans, Oat milk, Blueberries, Spinach, Pasta, Olive oil, Sea salt.',
    timestamp: 'Yesterday',
    date: 'Oct 23, 2023',
    tag: 'Health',
  },
  {
    id: '3',
    title: 'Meeting Minutes: Product Sync',
    content: 'Discussed the Q3 roadmap. Priority 1 is the mobile experience overhaul. Marketing team to provide assets by Friday.',
    timestamp: 'Aug 12',
    date: 'Aug 12, 2023',
    tag: 'Work',
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: '4',
    title: 'App Ideas 2024',
    content: '"Simplicity is the ultimate sophistication." - Focusing on minimal tools that do one thing exceptionally well.',
    timestamp: 'Aug 10',
    date: 'Aug 10, 2023',
    tag: 'Ideas',
  }
];

// --- Components ---

const TagBadge = ({ tag }: { tag: TagType }) => {
  const colors: Record<string, string> = {
    Design: 'bg-indigo-500/10 text-indigo-500',
    Health: 'bg-emerald-500/10 text-emerald-500',
    Work: 'bg-blue-500/10 text-blue-500',
    Personal: 'bg-amber-500/10 text-amber-500',
    Ideas: 'bg-purple-500/10 text-purple-500',
  };

  const colorClass = colors[tag] || 'bg-slate-500/10 text-slate-500';

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${colorClass}`}>
      {tag}
    </span>
  );
};

export default function App() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('notes');
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const handleAddNote = () => {
    setCurrentNote(null);
    setView('editor');
  };

  const handleEditNote = (note: Note) => {
    setCurrentNote(note);
    setView('editor');
  };

  const handleSaveNote = (title: string, content: string, tag?: TagType) => {
    const now = new Date();
    const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const date = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    if (currentNote) {
      setNotes(notes.map(n => n.id === currentNote.id ? { ...n, title, content, tag, timestamp, date } : n));
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        title,
        content,
        timestamp,
        date,
        tag: tag || 'Personal',
      };
      setNotes([newNote, ...notes]);
    }
    setView('list');
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
    if (currentNote?.id === id) setView('list');
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const availableTags = Array.from(new Set([
    'Design', 'Health', 'Work', 'Personal', 'Ideas',
    ...notes.map(n => n.tag).filter((t): t is string => !!t)
  ]));

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans selection:bg-primary/30">
      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-2xl mx-auto px-4 py-6"
          >
            <header className="flex items-center justify-between mb-8 sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md py-2">
              <h1 className="text-2xl font-bold tracking-tight">My Notes Collection</h1>
            </header>

            <div className="space-y-4 pb-24">
              <AnimatePresence>
                {isSearchVisible && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="relative overflow-hidden"
                  >
                    <input 
                      autoFocus
                      type="text" 
                      placeholder="Search your notes..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 pl-10 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <button 
                      onClick={() => {
                        setIsSearchVisible(false);
                        setSearchQuery('');
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X size={18} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {filteredNotes.length > 0 ? (
                filteredNotes.map((note) => (
                  <motion.div 
                    layout
                    key={note.id}
                    onClick={() => handleEditNote(note)}
                    className="group flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer"
                  >
                    {note.imageUrl && (
                      <div className="w-full h-40 overflow-hidden">
                        <img 
                          src={note.imageUrl} 
                          alt={note.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">{note.title}</h3>
                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{note.timestamp}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-2 mb-4">
                        {note.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {note.tag && <TagBadge tag={note.tag} />}
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNote(note.id);
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-20 text-slate-500">
                  <p>No notes yet. Click the + button to start.</p>
                </div>
              )}
            </div>

            <div className="fixed bottom-8 right-6 md:right-1/2 md:translate-x-[300px] flex flex-col gap-3 z-20">
              <button 
                onClick={() => setIsSearchVisible(!isSearchVisible)}
                className={`size-12 flex items-center justify-center rounded-full shadow-lg transition-all ${isSearchVisible ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300' : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800'}`}
              >
                <Search size={24} />
              </button>
              <button 
                onClick={handleAddNote}
                className="size-14 flex items-center justify-center rounded-full bg-primary text-white shadow-xl shadow-primary/30 hover:scale-110 active:scale-95 transition-all"
              >
                <Plus size={28} />
              </button>
            </div>
          </motion.div>
        ) : (
          <NoteEditor 
            note={currentNote} 
            onBack={() => setView('list')} 
            onSave={handleSaveNote}
            onDelete={currentNote ? () => handleDeleteNote(currentNote.id) : undefined}
            availableTags={availableTags}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Editor Component ---

interface NoteEditorProps {
  note: Note | null;
  onBack: () => void;
  onSave: (title: string, content: string, tag?: TagType) => void;
  onDelete?: () => void;
  availableTags: TagType[];
}

function NoteEditor({ note, onBack, onSave, onDelete, availableTags }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [tag, setTag] = useState<TagType>(note?.tag || 'Personal');
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [isAddingCustomTag, setIsAddingCustomTag] = useState(false);
  const [customTag, setCustomTag] = useState('');

  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTag.trim()) {
      setTag(customTag.trim());
      setCustomTag('');
      setIsAddingCustomTag(false);
    }
  };

  return (
    <motion.div 
      key="editor"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-2xl mx-auto h-screen flex flex-col bg-background-light dark:bg-background-dark"
    >
      <header className="flex items-center px-6 py-4 justify-between border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Edit3 size={20} className="text-primary" />
            <h2 className="text-lg font-bold tracking-tight">Instant Note</h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onDelete && (
            <button 
              onClick={onDelete}
              className="p-2 rounded-full hover:bg-red-500/10 text-slate-500 hover:text-red-500 transition-colors"
            >
              <Trash2 size={20} />
            </button>
          )}
          <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
            <MoreHorizontal size={20} className="text-slate-500" />
          </button>
        </div>
      </header>

      <div className="px-6 py-4">
        <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
          <Clock size={12} />
          {note ? `Editing: ${note.date} • ${note.timestamp}` : `New Note: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
        </p>
      </div>

      <main className="flex-1 flex flex-col px-6 overflow-y-auto no-scrollbar">
        <div className="mb-6">
          <input 
            autoFocus={!note}
            className="w-full bg-transparent border-none p-0 text-3xl font-bold text-slate-900 dark:text-slate-50 placeholder:text-slate-300 dark:placeholder:text-slate-700 focus:ring-0 focus:outline-none" 
            placeholder="Note Title..." 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex-1 flex flex-col">
          <textarea 
            className="flex-1 w-full bg-transparent border-none p-0 text-lg leading-relaxed text-slate-700 dark:text-slate-300 placeholder:text-slate-300 dark:placeholder:text-slate-700 focus:ring-0 focus:outline-none resize-none" 
            placeholder="Start writing your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>
      </main>

      <div className="px-6 py-6 border-t border-slate-200 dark:border-slate-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 relative">
            <button 
              onClick={() => {
                setShowTagPicker(!showTagPicker);
                setIsAddingCustomTag(false);
              }}
              className="p-2 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-primary/10 transition-all border border-slate-200 dark:border-slate-700"
            >
              <Tag size={20} />
            </button>
            <button className="p-2 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-primary/10 transition-all border border-slate-200 dark:border-slate-700">
              <ImageIcon size={20} />
            </button>
            <button 
              onClick={() => {
                setIsAddingCustomTag(!isAddingCustomTag);
                setShowTagPicker(false);
              }}
              className="p-2 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-primary/10 transition-all border border-slate-200 dark:border-slate-700"
            >
              <Plus size={20} />
            </button>
            
            <AnimatePresence>
              {showTagPicker && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-full mb-2 left-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-2 z-30 min-w-[140px] max-h-[200px] overflow-y-auto no-scrollbar"
                >
                  <p className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 mb-1 sticky top-0 bg-white dark:bg-slate-900">Select Tag</p>
                  {availableTags.map(t => (
                    <button 
                      key={t}
                      onClick={() => {
                        setTag(t);
                        setShowTagPicker(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${tag === t ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
                    >
                      {t}
                    </button>
                  ))}
                </motion.div>
              )}

              {isAddingCustomTag && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-full mb-2 left-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-3 z-30 min-w-[200px]"
                >
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">New Tag</p>
                  <form onSubmit={handleAddCustomTag} className="flex gap-2">
                    <input 
                      autoFocus
                      type="text" 
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value)}
                      placeholder="Enter tag name..."
                      className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button 
                      type="submit"
                      className="bg-primary text-white p-1 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button 
            onClick={() => onSave(title, content, tag)}
            disabled={!title.trim() && !content.trim()}
            className="flex items-center gap-2 rounded-full px-8 py-3 bg-primary text-white font-bold text-base shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all"
          >
            <Save size={18} />
            Save
          </button>
        </div>
      </div>
    </motion.div>
  );
}
