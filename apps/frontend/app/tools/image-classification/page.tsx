"use client";

import { useEffect } from "react";
import ImageViewer from "@/components/image-classification/ImageViewer";
import ClassificationControls from "@/components/image-classification/ClassificationControls";
import FolderManager from "@/components/image-classification/FolderManager";
import ClassificationSummary from "@/components/image-classification/ClassificationSummary";
import { Download } from "lucide-react"; 
import { imageClassificationApi } from "@/api/imageClassification.api";

import { useImageClassification } from "@/hooks/useImageClassification";

export default function ImageClassificationPage() {
  const {
    images,
    currentImage,
    currentIndex,
    folders,
    selectedFolder,
    isProcessing,
    error,
    setSelectedFolder,
    addImages,
    createFolder,
    classifyImage,
    nextImage,
    previousImage,
    removeCurrentImage,
  } = useImageClassification();

  // Arrow keys ne image change karnya sathi Logic
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        nextImage();
      } else if (e.key === "ArrowLeft") {
        previousImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextImage, previousImage]);

  // Check kara ki sagle images classify zale ahet ka
  const isFinished = images.length > 0 && images.every((img) => img.classified);

  // Download handle karnya sathi function
  const handleDownload = async () => {
    try {
      // Backend setup nusar sessionId pass kara. Default "session-123" dila ahe.
      await imageClassificationApi.downloadSortedImages("session-123");
    } catch (err) {
      console.error("Failed to download ZIP", err);
      alert("Failed to download files. Backend server chalu ahe ka te check kara.");
    }
  };

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Image Classification</h1>
          <p className="mt-2 text-muted-foreground">
            Upload image folders and organize them using arrow keys.
          </p>
        </div>

        {/* Upload button */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Image Classification</h2>
              <p className="text-sm text-muted-foreground">
                {images.length} image{images.length !== 1 ? "s" : ""} uploaded
              </p>
            </div>

            <label className="cursor-pointer">
              <span className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
                + Add Folder / Images
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                // @ts-ignore - React madhe webkitdirectory standard type nasla tari chalto folder upload sathi
                webkitdirectory="true"
                directory="true"
                className="hidden"
                onChange={(event) => {
                  const files = Array.from(event.target.files ?? []);
                  if (files.length > 0) {
                    addImages(files);
                  }
                  event.target.value = "";
                }}
              />
            </label>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Jeha sagle images classify hotil tevha Download UI dakhavnar */}
        {isFinished ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-green-200 bg-green-50 p-10 text-center">
            <h2 className="text-2xl font-bold text-green-700 mb-4">
              All Images Classified!
            </h2>
            <p className="text-green-600 mb-6">You have successfully sorted all uploaded images.</p>
            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 rounded-md bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-700 transition"
            >
              <Download size={20} /> Download Sorted Folders
            </button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main image area */}
            <section className="space-y-6 lg:col-span-2">
              <div className="rounded-xl border border-border bg-card p-5 relative">
                
                {/* Image Counter (Top Right) */}
                {images.length > 0 && (
                  <div className="absolute top-5 right-5 text-sm font-bold bg-muted px-3 py-1 rounded-full">
                    {currentIndex + 1} / {images.length}
                  </div>
                )}

                <h2 className="mb-4 text-xl font-semibold">Images</h2>

                <ImageViewer
                  preview={currentImage?.preview}
                  currentIndex={currentIndex}
                  totalImages={images.length}
                  isClassified={currentImage?.classified}
                  // YETHE BADAL KELA AHE: folderName aivaji folder vaparla ahe
                  classifiedFolder={currentImage?.folder} 
                  onAddImages={addImages}
                  onPrevious={previousImage}
                  onNext={nextImage}
                  onRemove={removeCurrentImage}
                />
              </div>

              <ClassificationControls
                folders={folders}
                selectedFolder={selectedFolder}
                isProcessing={isProcessing}
                disabled={!currentImage || currentImage.classified}
                onFolderChange={setSelectedFolder}
                onClassify={classifyImage}
              />
            </section>

            {/* Right sidebar */}
            <aside className="space-y-6">
              <FolderManager
                folders={folders}
                selectedFolder={selectedFolder}
                onSelectFolder={setSelectedFolder}
                onCreateFolder={createFolder}
              />
              <ClassificationSummary
                folders={folders}
                totalImages={images.length}
              />
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}