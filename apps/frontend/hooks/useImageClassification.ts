"use client";

import { useCallback, useState } from "react";
import { imageClassificationApi } from "@/api/imageClassification.api";

export interface ImageItem {
  id: string;
  file: File;
  preview: string;
  folder?: string;
  classified: boolean;
}

export interface Folder {
  name: string;
  count: number;
}

export function useImageClassification() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [folders, setFolders] = useState<Folder[]>([
    { name: "Customer", count: 0 },
    { name: "Staff", count: 0 },
    { name: "Cash", count: 0 },
    { name: "Others", count: 0 },
  ]);

  const [selectedFolder, setSelectedFolder] = useState("Customer");

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentImage = images[currentIndex];

  const addImages = useCallback((files: File[]) => {
    const validFiles = files.filter((file) =>
      file.type.startsWith("image/")
    );

    const newImages: ImageItem[] = validFiles.map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
      classified: false,
    }));

    setImages((previous) => [...previous, ...newImages]);
    setError(null);
  }, []);

  const createFolder = useCallback(
    async (folderName: string) => {
      const name = folderName.trim();

      if (!name) {
        setError("Folder name is required.");
        return;
      }

      const exists = folders.some(
        (folder) =>
          folder.name.toLowerCase() === name.toLowerCase()
      );

      if (exists) {
        setError("This folder already exists.");
        return;
      }

      try {
        await imageClassificationApi.createFolder(name);

        setFolders((previous) => [
          ...previous,
          {
            name,
            count: 0,
          },
        ]);

        setSelectedFolder(name);
        setError(null);
      } catch {
        setError("Unable to create folder.");
      }
    },
    [folders]
  );

  // YETHE CHANGE KELA AHE: folderName parameter add kela
  const classifyImage = useCallback(
    async (folderName?: string) => {
      if (!currentImage) {
        setError("Please upload an image first.");
        return;
      }

      // Jr parameter aala nasel, tr state madhla selectedFolder vapra
      const targetFolder = folderName || selectedFolder;

      if (!targetFolder) {
        setError("Please select a folder.");
        return;
      }

      if (currentImage.classified) {
        setError("This image is already classified.");
        return;
      }

      try {
        setIsProcessing(true);
        setError(null);

        await imageClassificationApi.classify(
          currentImage.file,
          targetFolder
        );

        setImages((previous) =>
          previous.map((image, index) =>
            index === currentIndex
              ? {
                  ...image,
                  classified: true,
                  folder: targetFolder, // updated folder
                }
              : image
          )
        );

        setFolders((previous) =>
          previous.map((folder) =>
            folder.name === targetFolder
              ? {
                  ...folder,
                  count: folder.count + 1,
                }
              : folder
          )
        );

        // Classify zalyavar automatically pudhchya image var ja
        if (currentIndex < images.length - 1) {
          setCurrentIndex((previous) => previous + 1);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Image classification failed."
        );
      } finally {
        setIsProcessing(false);
      }
    },
    [currentImage, selectedFolder, currentIndex, images.length]
  );

  const nextImage = useCallback(() => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex((previous) => previous + 1);
    }
  }, [currentIndex, images.length]);

  const previousImage = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((previous) => previous - 1);
    }
  }, [currentIndex]);

  const removeCurrentImage = useCallback(() => {
    if (!currentImage) {
      return;
    }

    URL.revokeObjectURL(currentImage.preview);

    setImages((previous) =>
      previous.filter((_, index) => index !== currentIndex)
    );

    setCurrentIndex((previous) =>
      Math.max(0, Math.min(previous, images.length - 2))
    );
  }, [currentImage, currentIndex, images.length]);

  return {
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
  };
}