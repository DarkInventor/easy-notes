// app/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { MenuIcon } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { NoteEditor } from '@/components/NoteEditor';

type Block = {
  id: number;
  content: string;
  type: 'text' | 'heading1' | 'heading2' | 'heading3' | 'bullet' | 'numbered' | 'image';
  style?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    color?: string;
    align?: 'left' | 'center' | 'right';
  };
  imageUrl?: string;
};

type Note = {
  id: number;
  title: string;
  blocks: Block[];
};

export default function NotionClone() {
  const [notes, setNotes] = useState<Note[]>([
    { id: 1, title: 'Welcome Note', blocks: [{ id: 1, content: 'Welcome to your Notion clone!', type: 'text' }] }
  ]);
  const [activeNoteId, setActiveNoteId] = useState<number | null>(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }

    const savedActiveNoteId = localStorage.getItem('activeNoteId');
    if (savedActiveNoteId) {
      setActiveNoteId(Number(savedActiveNoteId));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('activeNoteId', String(activeNoteId));
  }, [activeNoteId]);

  const addNote = () => {
    const newNote: Note = {
      id: Date.now(),
      title: 'Untitled',
      blocks: [{ id: Date.now(), content: '', type: 'text' }]
    };
    setNotes([...notes, newNote]);
    setActiveNoteId(newNote.id);
  };

  const updateNoteTitle = (id: number, title: string) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, title } : note
    ));
  };

  const addBlock = (noteId: number, index: number, type: Block['type'] = 'text') => {
    setNotes(notes.map(note => {
      if (note.id === noteId) {
        const newBlocks = [...note.blocks];
        newBlocks.splice(index + 1, 0, { id: Date.now(), content: '', type });
        return { ...note, blocks: newBlocks };
      }
      return note;
    }));
  };

  const updateBlock = (noteId: number, blockId: number, content: string, style?: Block['style']) => {
    setNotes(notes.map(note => {
      if (note.id === noteId) {
        return {
          ...note,
          blocks: note.blocks.map(block =>
            block.id === blockId ? { ...block, content, style } : block
          )
        };
      }
      return note;
    }));
  };

  const updateBlockType = (noteId: number, blockId: number, type: Block['type']) => {
    setNotes(notes.map(note => {
      if (note.id === noteId) {
        return {
          ...note,
          blocks: note.blocks.map(block =>
            block.id === blockId ? { ...block, type } : block
          )
        };
      }
      return note;
    }));
  };

  const uploadImage = async (noteId: number, blockId: number, file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setNotes(notes.map(note => {
      if (note.id === noteId) {
        return {
          ...note,
          blocks: note.blocks.map(block =>
            block.id === blockId ? { ...block, type: 'image', imageUrl } : block
          )
        };
      }
      return note;
    }));
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
    if (activeNoteId === id) {
      setActiveNoteId(notes[0]?.id || null);
    }
  };

  const activeNote = notes.find(note => note.id === activeNoteId);

  return (
    <div className="flex h-screen bg-white text-gray-900">
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            exit={{ x: -250 }}
          >
            <Sidebar
              notes={notes}
              activeNoteId={activeNoteId}
              addNote={addNote}
              setActiveNoteId={setActiveNoteId}
              deleteNote={deleteNote}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center p-4 border-b border-gray-200">
          <Button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            variant="ghost"
            size="icon"
            className="mr-4"
          >
            <MenuIcon className="h-5 w-5" />
          </Button>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {activeNote ? (
            <NoteEditor
              activeNote={activeNote}
              updateNoteTitle={updateNoteTitle}
              updateBlock={updateBlock}
              updateBlockType={updateBlockType}
              addBlock={addBlock}
              uploadImage={uploadImage}
            />
          ) : (
            <div className="text-center text-gray-500 mt-10">
              Select a note or create a new one
            </div>
          )}
        </main>
      </div>
    </div>
  );
}