import api from './api';

interface UploadResponse {
  filename: string;
  originalName: string;
  size: number;
  mimetype?: string;
  url: string;
}

class UploadsService {
  /**
   * Upload une photo de session
   * @param file - Le fichier image à uploader
   * @returns L'URL de la photo uploadée
   */
  async uploadSessionPhoto(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('photo', file);

    const response = await api.post<{ success: boolean; data: UploadResponse }>(
      '/uploads/session-photo',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.data.url;
  }

  /**
   * Supprime une photo de session
   * @param filename - Le nom du fichier à supprimer
   */
  async deleteSessionPhoto(filename: string): Promise<void> {
    await api.delete(`/uploads/session-photo/${filename}`);
  }
}

export default new UploadsService();

