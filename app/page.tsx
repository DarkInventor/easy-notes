// "use client";

// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   ContextMenu,
//   ContextMenuContent,
//   ContextMenuItem,
//   ContextMenuTrigger,
// } from "@/components/ui/context-menu";
// import { PlusIcon, ChevronDownIcon, MenuIcon, MoreHorizontalIcon } from 'lucide-react';

// type Block = {
//   id: number;
//   content: string;
//   type: 'text' | 'heading1' | 'heading2' | 'heading3' | 'bullet' | 'numbered';
// };

// type Note = {
//   id: number;
//   title: string;
//   blocks: Block[];
// };

// export default function NotionClone() {
//   const [notes, setNotes] = useState<Note[]>(() => {
//     const savedNotes = localStorage.getItem('notes');
//     return savedNotes ? JSON.parse(savedNotes) : [
//       { id: 1, title: 'Welcome Note', blocks: [{ id: 1, content: 'Welcome to your Notion clone!', type: 'text' }] }
//     ];
//   });

//   const [activeNoteId, setActiveNoteId] = useState<number | null>(() => {
//     const savedActiveNoteId = localStorage.getItem('activeNoteId');
//     return savedActiveNoteId ? Number(savedActiveNoteId) : 1;
//   });

//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   useEffect(() => {
//     localStorage.setItem('notes', JSON.stringify(notes));
//   }, [notes]);

//   useEffect(() => {
//     localStorage.setItem('activeNoteId', String(activeNoteId));
//   }, [activeNoteId]);

//   const addNote = () => {
//     const newNote: Note = {
//       id: Date.now(),
//       title: 'Untitled',
//       blocks: [{ id: Date.now(), content: '', type: 'text' }]
//     };
//     setNotes([...notes, newNote]);
//     setActiveNoteId(newNote.id);
//   };

//   const updateNoteTitle = (id: number, title: string) => {
//     setNotes(notes.map(note => 
//       note.id === id ? { ...note, title } : note
//     ));
//   };

//   const addBlock = (noteId: number, index: number, type: Block['type'] = 'text') => {
//     setNotes(notes.map(note => {
//       if (note.id === noteId) {
//         const newBlocks = [...note.blocks];
//         newBlocks.splice(index + 1, 0, { id: Date.now(), content: '', type });
//         return { ...note, blocks: newBlocks };
//       }
//       return note;
//     }));
//   };

//   const updateBlock = (noteId: number, blockId: number, content: string) => {
//     setNotes(notes.map(note => {
//       if (note.id === noteId) {
//         return {
//           ...note,
//           blocks: note.blocks.map(block =>
//             block.id === blockId ? { ...block, content } : block
//           )
//         };
//       }
//       return note;
//     }));
//   };

//   const updateBlockType = (noteId: number, blockId: number, newType: Block['type']) => {
//     setNotes(notes.map(note => {
//       if (note.id === noteId) {
//         return {
//           ...note,
//           blocks: note.blocks.map(block =>
//             block.id === blockId ? { ...block, type: newType } : block
//           )
//         };
//       }
//       return note;
//     }));
//   };

//   const deleteNote = (id: number) => {
//     setNotes(notes.filter(note => note.id !== id));
//     if (activeNoteId === id) {
//       setActiveNoteId(notes[0]?.id || null);
//     }
//   };

//   const activeNote = notes.find(note => note.id === activeNoteId);

//   return (
//     <div className="flex h-screen bg-white text-gray-900">
//       {/* Sidebar */}
//       <AnimatePresence>
//         {isSidebarOpen && (
//           <motion.div
//             initial={{ x: -250 }}
//             animate={{ x: 0 }}
//             exit={{ x: -250 }}
//             className="w-60 bg-gray-50 border-r border-gray-200 overflow-y-auto"
//           >
//             <div className="p-4">
//               <Button 
//                 onClick={addNote} 
//                 className="w-full mb-4 bg-transparent text-gray-700 hover:bg-gray-200 border border-gray-300"
//               >
//                 <PlusIcon className="mr-2 h-4 w-4" /> New page
//               </Button>
//               <div className="space-y-1">
//                 {notes.map(note => (
//                   <ContextMenu key={note.id}>
//                     <ContextMenuTrigger>
//                       <div
//                         className={`p-2 rounded cursor-pointer flex items-center ${activeNoteId === note.id ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
//                         onClick={() => setActiveNoteId(note.id)}
//                       >
//                         <ChevronDownIcon className="mr-2 h-4 w-4 text-gray-500" />
//                         <span className="flex-grow truncate">{note.title}</span>
//                         <MoreHorizontalIcon className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" />
//                       </div>
//                     </ContextMenuTrigger>
//                     <ContextMenuContent>
//                       <ContextMenuItem onClick={() => deleteNote(note.id)}>
//                         Delete
//                       </ContextMenuItem>
//                     </ContextMenuContent>
//                   </ContextMenu>
//                 ))}
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Header */}
//         <header className="flex items-center p-4 border-b border-gray-200">
//           <Button 
//             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//             variant="ghost"
//             size="icon"
//             className="mr-4"
//           >
//             <MenuIcon className="h-5 w-5" />
//           </Button>
//           {activeNote && (
//             <Input
//               value={activeNote.title}
//               onChange={(e) => updateNoteTitle(activeNote.id, e.target.value)}
//               className="text-3xl font-bold border-none focus:ring-0 p-0 bg-transparent"
//               placeholder="Untitled"
//             />
//           )}
//         </header>

//         {/* Note Content */}
//         <main className="flex-1 p-6 overflow-y-auto">
//           {activeNote ? (
//             <div className="max-w-3xl mx-auto">
//               {activeNote.blocks.map((block, index) => (
//                 <motion.div
//                   key={block.id}
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ duration: 0.3 }}
//                   className="mb-1 group relative"
//                 >
//                   <Input
//                     value={block.content}
//                     onChange={(e) => updateBlock(activeNote.id, block.id, e.target.value)}
//                     placeholder={block.type === 'text' ? "Type '/' for commands" : ''}
//                     className={`w-full p-1 border-none focus:ring-0 ${
//                       block.type.startsWith('heading') 
//                         ? `text-${block.type === 'heading1' ? '2xl' : block.type === 'heading2' ? 'xl' : 'lg'} font-bold` 
//                         : 'text-base'
//                     } ${block.type.startsWith('bullet') ? 'pl-6 list-disc' : ''} ${block.type.startsWith('numbered') ? 'pl-6 list-decimal' : ''}`}
//                   />
//                   <Button 
//                     onClick={() => addBlock(activeNote.id, index)}
//                     className="absolute -left-6 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
//                     variant="ghost"
//                     size="sm"
//                   >
//                     <PlusIcon className="h-4 w-4" />
//                   </Button>
//                 </motion.div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center text-gray-500 mt-10">
//               Select a note or create a new one
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// }





"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { PlusIcon, ChevronDownIcon, MenuIcon, MoreHorizontalIcon } from 'lucide-react';

type Block = {
  id: number;
  content: string;
  type: 'text' | 'heading1' | 'heading2' | 'heading3' | 'bullet' | 'numbered';
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
    // Load notes from localStorage when the component mounts
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
    // Save notes to localStorage whenever they change
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    // Save activeNoteId to localStorage whenever it changes
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

  const updateBlock = (noteId: number, blockId: number, content: string) => {
    setNotes(notes.map(note => {
      if (note.id === noteId) {
        return {
          ...note,
          blocks: note.blocks.map(block =>
            block.id === blockId ? { ...block, content } : block
          )
        };
      }
      return note;
    }));
  };

  const updateBlockType = (noteId: number, blockId: number, newType: Block['type']) => {
    setNotes(notes.map(note => {
      if (note.id === noteId) {
        return {
          ...note,
          blocks: note.blocks.map(block =>
            block.id === blockId ? { ...block, type: newType } : block
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
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            exit={{ x: -250 }}
            className="w-60 bg-gray-50 border-r border-gray-200 overflow-y-auto"
          >
            <div className="p-4">
              <Button 
                onClick={addNote} 
                className="w-full mb-4 bg-transparent text-gray-700 hover:bg-gray-200 border border-gray-300"
              >
                <PlusIcon className="mr-2 h-4 w-4" /> New page
              </Button>
              <div className="space-y-1">
                {notes.map(note => (
                  <ContextMenu key={note.id}>
                    <ContextMenuTrigger>
                      <div
                        className={`p-2 rounded cursor-pointer flex items-center ${activeNoteId === note.id ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                        onClick={() => setActiveNoteId(note.id)}
                      >
                        <ChevronDownIcon className="mr-2 h-4 w-4 text-gray-500" />
                        <span className="flex-grow truncate">{note.title}</span>
                        <MoreHorizontalIcon className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" />
                      </div>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem onClick={() => deleteNote(note.id)}>
                        Delete
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center p-4 border-b border-gray-200">
          <Button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            variant="ghost"
            size="icon"
            className="mr-4"
          >
            <MenuIcon className="h-5 w-5" />
          </Button>
          {activeNote && (
            <Input
              value={activeNote.title}
              onChange={(e) => updateNoteTitle(activeNote.id, e.target.value)}
              className="text-3xl font-bold border-none focus:ring-0 p-0 bg-transparent"
              placeholder="Untitled"
            />
          )}
        </header>

        {/* Note Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {activeNote ? (
            <div className="max-w-3xl mx-auto">
              {activeNote.blocks.map((block, index) => (
                <motion.div
                  key={block.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mb-1 group relative"
                >
                  <Input
                    value={block.content}
                    onChange={(e) => updateBlock(activeNote.id, block.id, e.target.value)}
                    placeholder={block.type === 'text' ? "Type '/' for commands" : ''}
                    className={`w-full p-1 border-none focus:ring-0 ${
                      block.type.startsWith('heading') 
                        ? `text-${block.type === 'heading1' ? '2xl' : block.type === 'heading2' ? 'xl' : 'lg'} font-bold` 
                        : 'text-base'
                    } ${block.type.startsWith('bullet') ? 'pl-6 list-disc' : ''} ${block.type.startsWith('numbered') ? 'pl-6 list-decimal' : ''}`}
                  />
                  <Button 
                    onClick={() => addBlock(activeNote.id, index)}
                    className="absolute -left-6 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                    variant="ghost"
                    size="sm"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
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