import type { ExecutiveData } from '../types';

// Dynamic API configuration for both local and production
const getApiBaseUrl = () => {
  // In Vite, use import.meta.env and prefix with VITE_
  const isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;
  if (isDev) {
    // Local development - rely on Vite proxy or dev server rewrite
    return '/api';
  }
  // Production - use explicit API URL when provided, otherwise same-origin
  const apiUrl = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || '';
  return apiUrl ? `${apiUrl.replace(/\/$/, '')}/api` : '/api';
};

const API_BASE_URL = getApiBaseUrl();
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
      const url = `${API_BASE_URL}${endpoint}`;
      console.log('Making API request to:', url);
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      console.log('API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        return { error: `HTTP ${response.status}: ${errorText}` };
      }

      const data = await response.json();

      // Handle MongoDB _id field - convert to id for frontend compatibility
      const processedData = this.processMongoData(data);
      return { data: processedData };
    } catch (error) {
      console.error('API request failed:', error);
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
      
      // Migrate old data structure to new structure
      if (processed.accentColor && !processed.styleOptions) {
        processed.styleOptions = { accentColor: processed.accentColor };
        delete processed.accentColor;
      }
      
      // Ensure styleOptions exists
      if (!processed.styleOptions) {
        processed.styleOptions = { accentColor: '#00D1A6' };
      }
      
      // Ensure companyLogoPosition exists
      if (!processed.companyLogoPosition) {
        processed.companyLogoPosition = { x: 50, y: 50 };
      }
      
      // Ensure companyLogoSize exists
      if (!processed.companyLogoSize) {
        processed.companyLogoSize = 140;
      }
      
      // Ensure cardBackLogoSize exists
      if (!processed.cardBackLogoSize) {
        processed.cardBackLogoSize = 160;
      }
      
      // Ensure socials structure exists
      if (!processed.socials) {
        processed.socials = {
          linkedin: { url: '', enabled: false },
          instagram: { url: '', enabled: false },
          whatsapp: { url: '', enabled: false },
          facebook: { url: '', enabled: false },
          twitter: { url: '', enabled: false },
          youtube: { url: '', enabled: false }
        };
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