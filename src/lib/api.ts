// FastAPI Backend Integration
const API_BASE_URL = 'https://suety-hyperidealistically-crystle.ngrok-free.dev';

export interface Company {
  id: number;
  name: string;
  api_key: string;
  api_url: string;
  is_active: boolean;
}

export interface Ticket {
  id: number;
  company_id: number;
  ticket_id: string;
  ticket_number: string;
  status: string;
  category: string;
  priority?: string;
  created_by: string;
  assigned_to: string;
  comments: string;
  created_date_ts: number;
  age_seconds: number;
}

export interface TicketStats {
  total: number;
  by_status: Record<string, number>;
  by_category: Record<string, number>;
  avg_age_days: number | null;
}

export interface ImportResult {
  success: boolean;
  message: string;
  tickets_imported: number;
  processing_time: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Companies
  async getCompanies(): Promise<Company[]> {
    return this.request<Company[]>('/companies');
  }

  async createCompany(data: Omit<Company, 'id' | 'is_active'>): Promise<Company> {
    return this.request<Company>('/companies', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCompany(id: number): Promise<Company> {
    return this.request<Company>(`/companies/${id}`);
  }

  async deleteCompany(id: number): Promise<void> {
    return this.request(`/companies/${id}`, { method: 'DELETE' });
  }

  // Tickets
  async getTickets(params?: {
    company_id?: number;
    status?: string;
    category?: string;
    created_by?: string;
    assigned_to?: string;
    date_start?: string;
    date_end?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<Ticket[]> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    return this.request<Ticket[]>(`/tickets${query ? `?${query}` : ''}`);
  }

  async getTicketStats(params?: {
    company_id?: number;
    date_start?: string;
    date_end?: string;
  }): Promise<TicketStats> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    return this.request<TicketStats>(`/tickets/stats${query ? `?${query}` : ''}`);
  }

  async importTickets(data: {
    company_id: number;
    date_start: string;
    date_end?: string;
  }): Promise<ImportResult> {
    return this.request<ImportResult>('/tickets/import', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteTickets(company_id: number, date_before?: string): Promise<{ deleted: number }> {
    const params = new URLSearchParams({ company_id: String(company_id) });
    if (date_before) params.append('date_before', date_before);
    return this.request(`/tickets?${params}`, { method: 'DELETE' });
  }
}

export const api = new ApiClient();
