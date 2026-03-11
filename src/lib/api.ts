const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

class ApiError extends Error {
  constructor(public status: number, message: string, public code?: string) {
    super(message);
    this.name = "ApiError";
  }
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;
  private refreshToken: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    // Load token from localStorage on init
    this.token = localStorage.getItem("access_token");
    this.refreshToken = localStorage.getItem("refresh_token");
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem("access_token", token);
    } else {
      localStorage.removeItem("access_token");
    }
  }

  setRefreshToken(token: string | null) {
    this.refreshToken = token;
    if (token) {
      localStorage.setItem("refresh_token", token);
    } else {
      localStorage.removeItem("refresh_token");
    }
  }

  setTokens(accessToken: string | null, refreshToken: string | null) {
    this.setToken(accessToken);
    this.setRefreshToken(refreshToken);
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: response.statusText } }));
      throw new ApiError(
        response.status,
        errorData.error?.message || "Request failed",
        errorData.error?.code
      );
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  async register(data: {
    email: string;
    password: string;
    name: string;
  }) {
    const response = await this.request<{ user: User; tokens: { accessToken: string; refreshToken: string } }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    this.setTokens(response.tokens.accessToken, response.tokens.refreshToken);
    return response;
  }

  async login(email: string, password: string) {
    const response = await this.request<{ user: User; tokens: { accessToken: string; refreshToken: string } }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    this.setTokens(response.tokens.accessToken, response.tokens.refreshToken);
    return response;
  }

  async refreshSession() {
    if (!this.refreshToken) {
      throw new ApiError(401, "Missing refresh token", "UNAUTHORIZED");
    }
    const response = await this.request<{ tokens: { accessToken: string; refreshToken: string } }>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken: this.refreshToken }),
    });
    this.setTokens(response.tokens.accessToken, response.tokens.refreshToken);
    return response;
  }

  async logout() {
    try {
      if (this.refreshToken) {
        await this.request("/auth/logout", {
          method: "POST",
          body: JSON.stringify({ refreshToken: this.refreshToken }),
        });
      }
    } finally {
      this.setTokens(null, null);
    }
  }

  async getCurrentUser() {
    if (!this.token) return { user: null };
    try {
      return await this.request<{ user: User }>("/auth/me");
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        this.setTokens(null, null);
        return { user: null };
      }
      throw error;
    }
  }

  // Categories
  async getCategories() {
    return this.request<{ data: Category[] }>("/categories");
  }

  // Items
  async getItems(params?: {
    categoryId?: string;
    q?: string;
    minPrice?: number;
    maxPrice?: number;
    condition?: string;
    status?: string;
    page?: number;
    pageSize?: number;
  }) {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.append(key, String(value));
      });
    }
    return this.request<{ data: Item[]; meta: PaginationMeta }>(`/items?${query}`);
  }

  async getItem(id: string) {
    return this.request<{ data: Item }>(`/items/${id}`);
  }

  async createItem(data: CreateItemInput) {
    return this.request<{ data: Item }>("/items", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateItem(id: string, data: Partial<CreateItemInput>) {
    return this.request<{ data: Item }>(`/items/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteItem(id: string) {
    return this.request<void>(`/items/${id}`, { method: "DELETE" });
  }

  // Favorites
  async getFavorites(params?: { page?: number; pageSize?: number }) {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.append(key, String(value));
      });
    }
    return this.request<{ data: Favorite[]; meta: PaginationMeta }>(`/favorites?${query}`);
  }

  async addFavorite(itemId: string) {
    return this.request<{ data: Favorite }>("/favorites", {
      method: "POST",
      body: JSON.stringify({ itemId }),
    });
  }

  async removeFavorite(favoriteId: string) {
    return this.request<void>(`/favorites/${favoriteId}`, { method: "DELETE" });
  }

  // Messages
  async getThreads(params?: { itemId?: string; page?: number; pageSize?: number }) {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.append(key, String(value));
      });
    }
    return this.request<{ data: MessageThread[]; meta: PaginationMeta }>(`/messages?${query}`);
  }

  async getMessages(threadId: string, params?: { page?: number; pageSize?: number }) {
    const query = new URLSearchParams({ threadId });
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.append(key, String(value));
      });
    }
    return this.request<{ data: Message[]; meta: PaginationMeta }>(`/messages?${query}`);
  }

  async sendMessage(data: {
    threadId?: string;
    itemId?: string;
    recipientId?: string;
    body: string;
  }) {
    return this.request<{ data: Message }>("/messages", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async markMessageRead(messageId: string) {
    return this.request<{ data: Message }>(`/messages/${messageId}/read`, {
      method: "PATCH",
    });
  }

  // Orders
  async createOrder(data: { itemId: string; total?: number }) {
    return this.request<{ data: Order }>("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getOrders(params?: {
    role?: "buyer" | "seller";
    status?: string;
    page?: number;
    pageSize?: number;
  }) {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.append(key, String(value));
      });
    }
    return this.request<{ data: Order[]; meta: PaginationMeta }>(`/orders?${query}`);
  }

  async updateOrderStatus(orderId: string, status: string) {
    return this.request<{ data: Order }>(`/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  // Uploads
  async uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const headers: HeadersInit = {};
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}/uploads`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: response.statusText } }));
      throw new ApiError(
        response.status,
        errorData.error?.message || "Upload failed",
        errorData.error?.code
      );
    }

    return response.json() as Promise<{ data: { path: string } }>;
  }
}

// Types
export interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  emailVerifiedAt?: string | null;
}

export const resolveAssetUrl = (path: string | null | undefined) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const prefix = path.startsWith("/") ? "" : "/";
  return `${API_ORIGIN}${prefix}${path}`;
};

export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  price: string;
  condition: string;
  status: string;
  categoryId: string;
  sellerId: string;
  images: string[];
  category: Category;
  seller: { id: string; email: string; name: string | null };
  createdAt: string;
  updatedAt: string;
}

export interface CreateItemInput {
  title: string;
  description: string;
  price: number;
  condition: string;
  status?: string;
  categoryId: string;
  images: string[];
}

export interface Favorite {
  id: string;
  userId: string;
  itemId: string;
  item: Item;
  createdAt: string;
}

export interface MessageThread {
  id: string;
  itemId: string;
  buyerId: string;
  sellerId: string;
  item: { id: string; title: string; price: string; images: string[] };
  unreadCount: number;
  lastMessage: Message | null;
  createdAt: string;
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  itemId: string;
  buyerId: string;
  sellerId: string;
  status: string;
  total: string;
  item: { id: string; title: string; price: string; images: string[] };
  buyer: { id: string; email: string; name: string | null };
  seller: { id: string; email: string; name: string | null };
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
}

export const apiClient = new ApiClient(API_BASE_URL);
export { ApiError };
