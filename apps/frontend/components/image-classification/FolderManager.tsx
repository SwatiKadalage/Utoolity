"use client";

import { useState } from "react";
import { Button } from "@repo/ui/shadcn/button";
import { Plus } from "lucide-react"; // + icon sathi lucide-react

interface Folder {
  name: string;
  count: number;
}

interface FolderManagerProps {
  folders: Folder[];
  selectedFolder: string;
  onSelectFolder: (folder: string) => void;
  onCreateFolder: (name: string) => void;
}

// Max 5 buttons sathi fixed colors
const FOLDER_COLORS = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-orange-500",
  "bg-purple-500",
];

export default function FolderManager({
  folders,
  selectedFolder,
  onSelectFolder,
  onCreateFolder,
}: FolderManagerProps) {
  const [folderName, setFolderName] = useState("");
  const [showInput, setShowInput] = useState(false);

  const handleCreate = () => {
    const name = folderName.trim();

    if (!name) {
      return;
    }

    // Max 5 categories validation
    if (folders.length >= 5) {
      alert("Maximum 5 categories are allowed!");
      return;
    }

    onCreateFolder(name);
    setFolderName("");
    setShowInput(false);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">
            Folders
          </h2>
          <p className="text-sm text-muted-foreground">
            Organize classified images (Max 5)
          </p>
        </div>

        {/* Circular '+' Button */}
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full flex items-center justify-center"
          onClick={() => setShowInput((value) => !value)}
          disabled={folders.length >= 5}
          title="Create Folder"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {showInput && folders.length < 5 && (
        <div className="mt-4 space-y-2">
          <input
            value={folderName}
            onChange={(event) => setFolderName(event.target.value)}
            placeholder="Folder name"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleCreate();
              }
            }}
          />

          <Button
            size="sm"
            className="w-full"
            onClick={handleCreate}
          >
            Create Folder
          </Button>
        </div>
      )}

      <div className="mt-5 space-y-2">
        {folders.map((folder, index) => {
          const selected = selectedFolder === folder.name;
          const colorClass = FOLDER_COLORS[index % 5]; // Assign fixed color

          return (
            <button
              key={folder.name}
              type="button"
              onClick={() => onSelectFolder(folder.name)}
              className={[
                "flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left transition text-white shadow-sm",
                colorClass,
                selected
                  ? "ring-2 ring-offset-2 ring-black opacity-100"
                  : "hover:opacity-80 opacity-90",
              ].join(" ")}
            >
              <span className="flex items-center gap-2">
                <span>📁</span>
                <span className="text-sm font-medium">
                  {folder.name}
                </span>
              </span>

              <span className="text-sm font-bold bg-black/20 px-2.5 py-0.5 rounded-full">
                {folder.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}