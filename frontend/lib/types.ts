export interface User {
  id: number;
  name: string;
  email: string;
  role_id: number;
  role?: Role;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: number;
  name: string;
  display_name: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface AiTool {
  id: number;
  name: string;
  slug: string;
  description: string;
  url?: string;
  documentation_url?: string;
  how_to_use?: string;
  examples?: string;
  logo_url?: string;
  images?: string[];
  category_id: number;
  category?: Category;
  created_by: number;
  creator?: User;
  suitable_for_roles?: number[];
  status: "active" | "pending" | "archived";
  views_count: number;
  tags?: Tag[];
  recommendations?: ToolRecommendation[];
  average_rating?: number;
  recommendations_count?: number;
  created_at: string;
  updated_at: string;
}

export interface ToolRecommendation {
  id: number;
  tool_id: number;
  user_id: number;
  user?: User;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role_id: number;
  company?: string;
  date_of_birth?: string;
  country?: string;
  profession?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
