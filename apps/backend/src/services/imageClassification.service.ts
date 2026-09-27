import fs from 'fs';
import path from 'path';
const archiver = require('archiver');
// // import archiver from 'archiver';
// import archiver = require('archiver');
const BASE_UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'classification');

// Ensure base directory exists
if (!fs.existsSync(BASE_UPLOAD_DIR)) {
  fs.mkdirSync(BASE_UPLOAD_DIR, { recursive: true });
}

export class ImageClassificationService {
  // 1. Create a new category folder
  static async createFolder(sessionId: string, folderName: string) {
    const folderPath = path.join(BASE_UPLOAD_DIR, sessionId, folderName);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    return folderPath;
  }

  // 2. Save the classified image into the specific folder
  static async saveImageToFolder(sessionId: string, folderName: string, file: Express.Multer.File) {
    const folderPath = path.join(BASE_UPLOAD_DIR, sessionId, folderName);
    
    // Create folder if it doesn't exist just in case
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const destinationPath = path.join(folderPath, file.originalname);
    
    // Move file from temp upload location to final category folder
    fs.renameSync(file.path, destinationPath);
    
    return destinationPath;
  }

  // 3. Create a ZIP of all sorted folders
  static async generateZip(sessionId: string, outputPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const sourceDir = path.join(BASE_UPLOAD_DIR, sessionId);
      const output = fs.createWriteStream(outputPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', () => resolve(outputPath));
      archive.on('error', (err) => reject(err));

      archive.pipe(output);
      archive.directory(sourceDir, false);
      archive.finalize();
    });
  }
}