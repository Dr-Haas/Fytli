import { api } from './api';

export interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  created_at: string;
  exercise_count?: number;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  icon?: string;
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {}

export const categoriesService = {
  // Récupérer toutes les catégories
  async getAll(): Promise<Category[]> {
    const response = await api.get('/categories');
    return response.data;
  },

  // Récupérer une catégorie par ID
  async getById(id: number): Promise<Category> {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  // Créer une nouvelle catégorie
  async create(data: CreateCategoryData): Promise<Category> {
    const response = await api.post('/categories', data);
    return response.data;
  },

  // Mettre à jour une catégorie
  async update(id: number, data: UpdateCategoryData): Promise<Category> {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  // Supprimer une catégorie
  async delete(id: number): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};

export default categoriesService;

