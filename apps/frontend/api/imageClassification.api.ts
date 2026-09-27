import { api } from "./client";

export interface ClassificationResponse {
  success: boolean;
  message: string;
  fileName: string;
  folderName: string;
  path: string;
}

export interface SummaryResponse {
  success: boolean;
  folders: Record<string, number>;
  total: number;
}

export const imageClassificationApi = {
  async classify(
    image: File,
    folderName: string
  ): Promise<ClassificationResponse> {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("folderName", folderName);

    const { data } = await api.post(
      "/tools/image-classification",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  },
  async createFolder(folderName: string) {
    const { data } = await api.post(
      "/tools/image-classification/folders",
      { folderName }
    );
    return data;
  },

  async getSummary(): Promise<SummaryResponse> {
    const { data } = await api.get(
      "/tools/image-classification/summary"
    );
    return data;
  },

  // Download Sorted Images API Call
  async downloadSortedImages(sessionId: string): Promise<void> {
    const response = await api.get(
      `/tools/image-classification/download/${sessionId}`,
      {
        responseType: 'blob', // Zip file download sathi he important ahe
      }
    );

    // Browser madhe file download trigger karnya sathi logic
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `sorted_images_${sessionId}.zip`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};