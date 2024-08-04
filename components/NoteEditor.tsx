// components/NoteEditor.tsx
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Image as ImageIcon,
  Plus,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  PaintBucket,
} from "lucide-react";
import { motion } from "framer-motion";

// AutoResizeTextarea component
const AutoResizeTextarea: React.FC<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
> = (props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };

  React.useEffect(resizeTextarea, [props.value]);

  return (
    <textarea
      {...props}
      ref={textareaRef}
      rows={1}
      style={{ resize: "none", overflow: "hidden" }}
      onChange={(e) => {
        resizeTextarea();
        props.onChange && props.onChange(e);
      }}
    />
  );
};

type Block = {
  id: number;
  content: string;
  type:
    | "text"
    | "heading1"
    | "heading2"
    | "heading3"
    | "bullet"
    | "numbered"
    | "image";
  style?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    color?: string;
    align?: "left" | "center" | "right";
  };
  imageUrl?: string;
};

type NoteEditorProps = {
  activeNote: { id: number; title: string; blocks: Block[] } | undefined;
  updateNoteTitle: (id: number, title: string) => void;
  updateBlock: (
    noteId: number,
    blockId: number,
    content: string,
    style?: Block["style"]
  ) => void;
  updateBlockType: (
    noteId: number,
    blockId: number,
    type: Block["type"]
  ) => void;
  addBlock: (noteId: number, index: number, type: Block["type"]) => void;
  uploadImage: (noteId: number, blockId: number, file: File) => Promise<void>;
};

export function NoteEditor({
  activeNote,
  updateNoteTitle,
  updateBlock,
  updateBlockType,
  addBlock,
  uploadImage,
}: NoteEditorProps) {
  const [selectedBlockId, setSelectedBlockId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!activeNote) return null;

  const handleStyleChange = (
    blockId: number,
    styleKey: keyof Block["style"],
    value: any
  ) => {
    const block = activeNote.blocks.find((b) => b.id === blockId);
    if (block) {
      const newStyle = { ...block.style, [styleKey]: value };
      updateBlock(activeNote.id, blockId, block.content, newStyle);
    }
  };

  const handleImageUpload = async (blockId: number) => {
    if (
      fileInputRef.current &&
      fileInputRef.current.files &&
      fileInputRef.current.files[0]
    ) {
      await uploadImage(activeNote.id, blockId, fileInputRef.current.files[0]);
    }
  };

  const handleAddNewBlock = () => {
    addBlock(activeNote.id, activeNote.blocks.length, "text");
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    block: Block,
    index: number
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (block.type === "bullet" || block.type === "numbered") {
        addBlock(activeNote.id, index + 1, block.type);
      } else {
        addBlock(activeNote.id, index + 1, "text");
      }
    }
  };

  const renderBlock = (block: Block, index: number) => {
    const commonClasses = `w-full p-2 border-none focus:ring-0
      ${block.style?.bold ? "font-bold" : ""}
      ${block.style?.italic ? "italic" : ""}
      ${block.style?.underline ? "underline" : ""}
      ${block.style?.color ? `text-${block.style.color}-500` : ""}
      ${block.style?.align ? `text-${block.style.align}` : ""}`;

    switch (block.type) {
      case "heading1":
      case "heading2":
      case "heading3":
      case "bullet":
      case "numbered":
      case "text":
        return (
          <AutoResizeTextarea
            value={block.content}
            onChange={(e) =>
              updateBlock(activeNote.id,         // @ts-ignore
                "block.id", e.target.value, block.style)
            }
            onKeyDown={(e) => handleKeyDown(e, block, index)}
            placeholder={block.type === "text" ? "Type '/' for commands" : ""}
            className={`${commonClasses} ${
              block.type.startsWith("heading")
                ? `text-${
                    block.type === "heading1"
                      ? "3xl"
                      : block.type === "heading2"
                      ? "2xl"
                      : "xl"
                  } font-bold`
                : "text-base"
            } ${block.type === "bullet" ? "pl-6 list-disc" : ""} 
              ${block.type === "numbered" ? "pl-6 list-decimal" : ""}`}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <AutoResizeTextarea
        value={activeNote.title}
        onChange={(e) => updateNoteTitle(activeNote.id, e.target.value)}
        className="text-4xl font-bold border-none focus:ring-0 p-0 bg-transparent mb-8 w-full"
        placeholder="Untitled"
      />
      {activeNote.blocks.map((block, index) => (
        <motion.div
          key={block.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-4 group relative"
          onFocus={() => setSelectedBlockId(block.id)}
        >
          {block.type === "image" && block.imageUrl ? (
            <img
              src={block.imageUrl}
              alt="Uploaded content"
              className="max-w-full h-auto"
            />
          ) : (
            <div className="relative">
              {renderBlock(block, index)}
              {selectedBlockId === block.id && (
                <div className="absolute left-0 top-[-60px] flex space-x-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56">
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          onClick={() =>
                            updateBlockType(activeNote.id, block.id, "text")
                          }
                          variant="ghost"
                          size="sm"
                        >
                          <Type className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() =>
                            updateBlockType(activeNote.id, block.id, "heading1")
                          }
                          variant="ghost"
                          size="sm"
                        >
                          <Heading1 className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() =>
                            updateBlockType(activeNote.id, block.id, "heading2")
                          }
                          variant="ghost"
                          size="sm"
                        >
                          <Heading2 className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() =>
                            updateBlockType(activeNote.id, block.id, "heading3")
                          }
                          variant="ghost"
                          size="sm"
                        >
                          <Heading3 className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() =>
                            updateBlockType(activeNote.id, block.id, "bullet")
                          }
                          variant="ghost"
                          size="sm"
                        >
                          <List className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() =>
                            updateBlockType(activeNote.id, block.id, "numbered")
                          }
                          variant="ghost"
                          size="sm"
                        >
                          <ListOrdered className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => {
                            updateBlockType(activeNote.id, block.id, "image");
                            fileInputRef.current?.click();
                          }}
                          variant="ghost"
                          size="sm"
                        >
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Button
                    onClick={() =>
                        // @ts-ignore
                      handleStyleChange(block.id, "bold", !block.style?.bold)
                    }
                    variant="ghost"
                    size="sm"
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() =>
                      handleStyleChange(
                        block.id,
                                // @ts-ignore
                        "italic",
                        !block.style?.italic
                      )
                    }
                    variant="ghost"
                    size="sm"
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() =>
                      handleStyleChange(
                        block.id,
                                // @ts-ignore
                        "underline",
                        !block.style?.underline
                      )
                    }
                    variant="ghost"
                    size="sm"
                  >
                    <Underline className="h-4 w-4" />
                  </Button>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <AlignLeft className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-32">
                      <div className="flex justify-between">
                        <Button
                          onClick={() =>
                            handleStyleChange(block.id,         // @ts-ignore 
                                "align", "left")
                          }
                          variant="ghost"
                          size="sm"
                        >
                          <AlignLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() =>
                            handleStyleChange(block.id, 
                                        // @ts-ignore
                                        "align", "center")
                          }
                          variant="ghost"
                          size="sm"
                        >
                          <AlignCenter className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() =>
                            handleStyleChange(block.id, 
                                        // @ts-ignore
                                        "align", "right")
                          }
                          variant="ghost"
                          size="sm"
                        >
                          <AlignRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <PaintBucket className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-32">
                      <div className="grid grid-cols-4 gap-1">
                        {[
                          "red",
                          "blue",
                          "green",
                          "yellow",
                          "purple",
                          "pink",
                          "gray",
                          "black",
                        ].map((color) => (
                          <Button
                            key={color}
                            onClick={() =>
                              handleStyleChange(block.id, 
                                        // @ts-ignore
                                        "color", color)
                            }
                            variant="ghost"
                            size="sm"
                            className={`bg-${color}-500 hover:bg-${color}-600`}
                          />
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>
          )}
        </motion.div>
      ))}
      <Button
        onClick={handleAddNewBlock}
        variant="ghost"
        className="w-full mt-4"
      >
        <Plus className="h-4 w-4 mr-2" /> Add new block
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={() =>
          handleImageUpload(activeNote.blocks[activeNote.blocks.length - 1].id)
        }
        accept="image/*"
      />
    </div>
  );
}
