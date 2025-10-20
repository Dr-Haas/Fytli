import api from './api';

interface UploadResponse {
  success: boolean;
  message: string;
  url: string;
  filename: string;
}

export const uploadsService = {
  async uploadImage(file: FormData): Promise<UploadResponse> {
    const response = await api.post<UploadResponse>('/uploads/image', file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async uploadVideo(file: FormData): Promise<UploadResponse> {
    const response = await api.post<UploadResponse>('/uploads/video', file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async uploadDocument(file: FormData): Promise<UploadResponse> {
    const response = await api.post<UploadResponse>('/uploads/document', file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async uploadMultipleImages(files: FormData): Promise<UploadResponse[]> {
    const response = await api.post<{ success: boolean; uploads: UploadResponse[] }>(
      '/uploads/images',
      files,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.uploads;
  },

  async uploadSessionPhoto(file: FormData): Promise<UploadResponse> {
    const response = await api.post<UploadResponse>('/uploads/session-photo', file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteSessionPhoto(filename: string): Promise<void> {
    await api.delete(`/uploads/session-photo/${filename}`);
  },
};

