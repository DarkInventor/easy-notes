// // components/Sidebar.tsx
// import { Button } from "@/components/ui/button";
// import { PlusIcon, ChevronDownIcon, MoreHorizontalIcon } from 'lucide-react';
// import {
//   ContextMenu,
//   ContextMenuContent,
//   ContextMenuItem,
//   ContextMenuTrigger,
// } from "@/components/ui/context-menu";

// type SidebarProps = {
//   notes: Note[];
//   activeNoteId: number | null;
//   addNote: () => void;
//   setActiveNoteId: (id: number) => void;
//   deleteNote: (id: number) => void;
// };

// export function Sidebar({ notes, activeNoteId, addNote, setActiveNoteId, deleteNote }: SidebarProps) {
//   return (
//     <div className="w-60 bg-gray-50 border-r border-gray-200 overflow-y-auto p-4 min-h-[1000px]">
//       <Button 
//         onClick={addNote} 
//         className="w-full mb-4 bg-transparent text-gray-700 hover:bg-gray-200 border border-gray-300"
//       >
//         <PlusIcon className="mr-2 h-4 w-4" /> New page
//       </Button>
//       <div className="space-y-1">
//         {notes.map(note => (
//           <ContextMenu key={note.id}>
//             <ContextMenuTrigger>
//               <div
//                 className={`p-2 rounded cursor-pointer flex items-center ${activeNoteId === note.id ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
//                 onClick={() => setActiveNoteId(note.id)}
//               >
//                 {/* <ChevronDownIcon className="mr-2 h-4 w-4 text-gray-500" /> */}
//                 <span className="flex-grow truncate">{note.title}</span>
//                 <MoreHorizontalIcon className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" />
//               </div>
//             </ContextMenuTrigger>
//             <ContextMenuContent>
//               <ContextMenuItem onClick={() => deleteNote(note.id)}>
//                 Delete
//               </ContextMenuItem>
//             </ContextMenuContent>
//           </ContextMenu>
//         ))}
//       </div>
//     </div>
//   );
// }

// components/Sidebar.tsx
import { Button } from "@/components/ui/button";
import { PlusIcon, ChevronDownIcon, MoreHorizontalIcon } from 'lucide-react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

type Note = {
  id: number;
  title: string;
  blocks: any[];
};

type SidebarProps = {
  notes: Note[];
  activeNoteId: number | null;
  addNote: () => void;
  setActiveNoteId: (id: number) => void;
  deleteNote: (id: number) => void;
};

export function Sidebar({ notes, activeNoteId, addNote, setActiveNoteId, deleteNote }: SidebarProps) {
  return (
    <div className="w-60 bg-white border-r border-gray-200 overflow-y-auto p-4">
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
  );
}