"use client";

import { Button } from "@repo/ui/shadcn/button";

interface Folder {
  name: string;
  count: number;
}

interface ClassificationControlsProps {
  folders: Folder[];
  selectedFolder: string;
  isProcessing: boolean;
  disabled: boolean;

  onFolderChange: (folder: string) => void;
  // Prop type update kela ahe jyamude to folderName gheu shakel
  onClassify: (folderName?: string) => void; 
}

// Max 5 buttons sathi fixed colors (hover states sobat)
const FOLDER_COLORS = [
  "bg-red-500 hover:bg-red-600",
  "bg-blue-500 hover:bg-blue-600",
  "bg-green-500 hover:bg-green-600",
  "bg-orange-500 hover:bg-orange-600",
  "bg-purple-500 hover:bg-purple-600",
];

export default function ClassificationControls({
  folders,
  selectedFolder,
  isProcessing,
  disabled,
  onFolderChange,
  onClassify,
}: ClassificationControlsProps) {
  
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-card-foreground">
          Classify Image
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Click a category below to move the current image into that folder.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {folders.length === 0 ? (
          <p className="text-sm italic text-muted-foreground">
            No folders available. Please create a folder first.
          </p>
        ) : (
          folders.map((folder, index) => {
            const colorClass = FOLDER_COLORS[index % 5];
            
            return (
              <Button
                key={folder.name}
                disabled={disabled || isProcessing}
                onClick={() => {
                  // Ekach veli state update ani API call
                  onFolderChange(folder.name); 
                  onClassify(folder.name); 
                }}
                className={`${colorClass} text-white border-none shadow-sm transition-all`}
              >
                {folder.name}
              </Button>
            );
          })
        )}
      </div>

      {isProcessing && (
        <div className="mt-4 text-sm font-medium text-primary animate-pulse">
          Moving image...
        </div>
      )}
    </div>
  );
}