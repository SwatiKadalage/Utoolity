"use client";

import { ChangeEvent, DragEvent } from "react";
import { Button } from "@repo/ui/shadcn/button";

interface ImageViewerProps {
  preview?: string;
  currentIndex: number;
  totalImages: number;
  isClassified?: boolean;
  classifiedFolder?: string; // Navin prop category name dakhvnya sathi

  onAddImages: (files: File[]) => void;
  onPrevious: () => void;
  onNext: () => void;
  onRemove: () => void;
}

export default function ImageViewer({
  preview,
  currentIndex,
  totalImages,
  isClassified,
  classifiedFolder,
  onAddImages,
  onPrevious,
  onNext,
  onRemove,
}: ImageViewerProps) {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length > 0) {
      onAddImages(files);
    }

    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const files = Array.from(event.dataTransfer.files);

    if (files.length > 0) {
      onAddImages(files);
    }
  };

  return (
    <div className="space-y-4">
      {!preview ? (
        <div
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
          className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 p-8 text-center"
        >
          <div className="mb-4 text-5xl">🖼️</div>

          <h2 className="text-xl font-semibold text-foreground">
            Upload Images or Folders
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Drag and drop folders/images here or select them
          </p>

          <label className="mt-5 cursor-pointer">
            <span className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition">
              + Add Folder / Images
            </span>

            <input
              type="file"
              accept="image/*"
              multiple
              // @ts-ignore - Folder selection support sathi
              webkitdirectory="true"
              directory="true"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
      ) : (
        <>
          <div className="relative overflow-hidden rounded-xl border border-border bg-muted/30">
            
            {/* Top Right: Image Number / Total Images */}
            <div className="absolute right-4 top-4 z-10 rounded-md bg-background/80 px-3 py-1 text-sm font-bold text-foreground shadow-sm backdrop-blur">
              {currentIndex + 1} / {totalImages}
            </div>

            {/* Top Left: Category Name (jr classify zali asel tr) */}
            {isClassified && classifiedFolder && (
              <div className="absolute left-4 top-4 z-10 rounded-md bg-black/80 px-3 py-1 text-sm font-semibold text-white shadow-sm backdrop-blur">
                Category: <span className="text-blue-400 ml-1">{classifiedFolder}</span>
              </div>
            )}

            <div className="flex min-h-[400px] items-center justify-center p-4">
              <img
                src={preview}
                alt={`Image ${currentIndex + 1}`}
                className="max-h-[500px] max-w-full rounded-lg object-contain"
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-between gap-2 mt-4">
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={currentIndex === 0}
            >
              ← Previous
            </Button>

            <Button
              variant="outline"
              onClick={onRemove}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              Remove
            </Button>

            <Button
              variant="outline"
              onClick={onNext}
              disabled={currentIndex === totalImages - 1}
            >
              Next →
            </Button>
          </div>
        </>
      )}
    </div>
  );
}