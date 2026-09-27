import { Request, Response } from 'express';
import { ImageClassificationService } from '../services/imageClassification.service';
import path from 'path';

// 1. Classify Image
export const classify = async (req: Request, res: Response) => {
  try {
    const { sessionId, folderName } = req.body;
    const file = req.file;

    if (!sessionId || !folderName || !file) {
      return res.status(400).json({ error: 'sessionId, folderName, and image file are required' });
    }

    await ImageClassificationService.saveImageToFolder(sessionId, folderName, file);
    res.status(200).json({ message: 'Image classified successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to classify image' });
  }
};

// 2. Create Folder
export const createFolder = async (req: Request, res: Response) => {
  try {
    const { sessionId, folderName } = req.body;
    
    if (!sessionId || !folderName) {
      return res.status(400).json({ error: 'sessionId and folderName are required' });
    }

    await ImageClassificationService.createFolder(sessionId, folderName);
    res.status(200).json({ message: `Folder ${folderName} created successfully.` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create folder' });
  }
};

// 3. Get Summary
export const getSummary = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.query;
    // Turchya requirement nusar summary logic ithe add kara
    res.status(200).json({ message: 'Summary fetched successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
};

// 4. Download Sorted Images (ZIP)
export const downloadSortedImages = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId is required' });
    }

    const zipName = `sorted_images_${sessionId}.zip`;
    const zipPath = path.join(process.cwd(), 'uploads', zipName);

    await ImageClassificationService.generateZip(sessionId, zipPath);

    res.download(zipPath, zipName, (err) => {
      // Error handling or file cleanup logic
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate download' });
  }
};