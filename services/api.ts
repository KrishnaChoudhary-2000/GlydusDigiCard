import type { ExecutiveData } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';
const IMGBB_API_KEY = 'a4ffb711bb7e22187e16d0a6398d35d0';
const IMGBB_API_URL = 'https://api.imgbb.com/1/upload';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface ImgBBResponse {
  data: {
    id: string;
    title: string;
    url: string;
    display_url: string;
    delete_url: string;
    size: number;
    time: string;
  };
  success: boolean;
  status: number;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || 'An error occurred' };
      }

      // Handle MongoDB _id field - convert to id for frontend compatibility
      const processedData = this.processMongoData(data);
      return { data: processedData };
    } catch (error) {
      return { error: 'Network error occurred' };
    }
  }

  private processMongoData(data: any): any {
    if (Array.isArray(data)) {
      return data.map(item => this.processMongoData(item));
    }
    
    if (data && typeof data === 'object') {
      const processed = { ...data };
      // Convert MongoDB _id to id for frontend compatibility
      if (processed._id && !processed.id) {
        processed.id = processed._id;
      }
      return processed;
    }
    
    return data;
  }

  // Upload image to ImgBB
  async uploadImage(file: File): Promise<ApiResponse<{ url: string; display_url: string; delete_url: string }>> {
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('key', IMGBB_API_KEY);

      const response = await fetch(IMGBB_API_URL, {
        method: 'POST',
        body: formData,
      });

      const data: ImgBBResponse = await response.json();

      if (!data.success) {
        return { error: 'Failed to upload image' };
      }

      return {
        data: {
          url: data.data.url,
          display_url: data.data.display_url,
          delete_url: data.data.delete_url,
        }
      };
    } catch (error) {
      return { error: 'Failed to upload image' };
    }
  }

  // Create short URL for NFC cards
  async createShortUrl(cardId: string): Promise<ApiResponse<{ shortUrl: string; shortId: string; cardId: string }>> {
    return this.request<{ shortUrl: string; shortId: string; cardId: string }>('/cards/shorten', {
      method: 'POST',
      body: JSON.stringify({ cardId }),
    });
  }

  // Get card by short ID
  async getCardByShortId(shortId: string): Promise<ApiResponse<ExecutiveData>> {
    return this.request<ExecutiveData>(`/cards/resolve/${shortId}`);
  }

  // Get all cards
  async getCards(): Promise<ApiResponse<ExecutiveData[]>> {
    return this.request<ExecutiveData[]>('/cards');
  }

  // Get single card
  async getCard(id: string): Promise<ApiResponse<ExecutiveData>> {
    return this.request<ExecutiveData>(`/cards/${id}`);
  }

  // Create new card
  async createCard(cardData: Omit<ExecutiveData, 'id'>): Promise<ApiResponse<ExecutiveData>> {
    // Add a unique ID for the card
    const cardWithId = {
      ...cardData,
      id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    return this.request<ExecutiveData>('/cards', {
      method: 'POST',
      body: JSON.stringify(cardWithId),
    });
  }

  // Update card
  async updateCard(id: string, cardData: Partial<ExecutiveData>): Promise<ApiResponse<ExecutiveData>> {
    return this.request<ExecutiveData>(`/cards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cardData),
    });
  }

  // Delete card
  async deleteCard(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/cards/${id}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; message: string; timestamp: string }>> {
    return this.request<{ status: string; message: string; timestamp: string }>('/health');
  }
}

export const apiService = new ApiService(); 