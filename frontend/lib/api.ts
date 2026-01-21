const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8201";

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "Accept": "application/json",
    };

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || "Грешка при зареждане на данни" };
      }

      return { data };
    } catch (error) {
      console.error("API Error:", error);
      return { error: "Неуспешна връзка със сървъра" };
    }
  }

  async post<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || "Грешка при изпращане на данни" };
      }

      return { data };
    } catch (error) {
      console.error("API Error:", error);
      return { error: "Неуспешна връзка със сървъра" };
    }
  }

  async put<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || "Грешка при обновяване на данни" };
      }

      return { data };
    } catch (error) {
      console.error("API Error:", error);
      return { error: "Неуспешна връзка със сървъра" };
    }
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "DELETE",
        headers: this.getHeaders(),
      });

      if (response.status === 204) {
        return { data: {} as T };
      }

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || "Грешка при изтриване на данни" };
      }

      return { data };
    } catch (error) {
      console.error("API Error:", error);
      return { error: "Неуспешна връзка със сървъра" };
    }
  }
}

export const api = new ApiClient(API_URL);
export default api;
