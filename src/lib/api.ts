// FastAPI Backend Integration
const API_BASE_URL = 'https://suety-hyperidealistically-crystle.ngrok-free.dev';

export interface Company {
  id: number;
  name: string;
  api_key: string;
  api_url: string;
  is_active: boolean;
  webhook_secret?: string;
  email_recipients?: string[];
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
  tickets_skipped: number;
  email_sent: boolean;
  recipients?: string[];
  processing_time: number;
}

// Scheduled Reports
export interface ScheduledReport {
  id: number;
  company_id: number;
  name: string;
  description?: string;
  report_type: string;
  schedule_type: 'cron' | 'interval';
  cron_expression?: string;
  interval_minutes?: number;
  recipients: string[];
  cc_recipients?: string[];
  filters?: {
    status?: string;
    category?: string;
    date_range_days?: number;
  };
  email_subject?: string;
  email_body?: string;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
  last_run?: string;
  next_run?: string;
}

export interface ScheduledReportCreate {
  company_id: number;
  name: string;
  description?: string;
  report_type: string;
  schedule_type: 'cron' | 'interval';
  cron_expression?: string;
  interval_minutes?: number;
  recipients: string[];
  cc_recipients?: string[];
  filters?: {
    status?: string;
    category?: string;
    date_range_days?: number;
  };
  email_subject?: string;
  email_body?: string;
  is_active?: boolean;
  created_by?: string;
}

export interface ScheduledReportUpdate {
  name?: string;
  description?: string;
  report_type?: string;
  schedule_type?: 'cron' | 'interval';
  cron_expression?: string;
  interval_minutes?: number;
  recipients?: string[];
  cc_recipients?: string[];
  filters?: {
    status?: string;
    category?: string;
    date_range_days?: number;
  };
  email_subject?: string;
  email_body?: string;
  is_active?: boolean;
}

export interface ReportExecution {
  id: number;
  schedule_id: number;
  company_id: number;
  execution_time: string;
  status: 'success' | 'failed' | 'running';
  tickets_count?: number;
  recipients_count?: number;
  error_message?: string;
  duration_seconds?: number;
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
    send_email?: boolean;
    recipient_emails?: string[];
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

  // Scheduled Reports
  async getScheduledReports(params?: {
    company_id?: number;
    is_active?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<ScheduledReport[]> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    return this.request<ScheduledReport[]>(`/scheduled-reports${query ? `?${query}` : ''}`);
  }

  async getScheduledReport(id: number): Promise<ScheduledReport> {
    return this.request<ScheduledReport>(`/scheduled-reports/${id}`);
  }

  async createScheduledReport(data: ScheduledReportCreate): Promise<ScheduledReport> {
    return this.request<ScheduledReport>('/scheduled-reports', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateScheduledReport(id: number, data: ScheduledReportUpdate): Promise<ScheduledReport> {
    return this.request<ScheduledReport>(`/scheduled-reports/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteScheduledReport(id: number): Promise<{ success: boolean; message: string }> {
    return this.request(`/scheduled-reports/${id}`, { method: 'DELETE' });
  }

  async executeScheduledReport(id: number): Promise<{ success: boolean; message: string }> {
    return this.request(`/scheduled-reports/${id}/execute`, { method: 'POST' });
  }

  async toggleScheduledReport(id: number): Promise<ScheduledReport> {
    return this.request<ScheduledReport>(`/scheduled-reports/${id}/toggle`, { method: 'POST' });
  }

  async getReportExecutions(scheduleId: number, params?: {
    limit?: number;
    offset?: number;
  }): Promise<ReportExecution[]> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, String(value));
      });
    }
    const query = searchParams.toString();
    return this.request<ReportExecution[]>(`/scheduled-reports/${scheduleId}/executions${query ? `?${query}` : ''}`);
  }

  async getRecentExecutions(params?: {
    company_id?: number;
    status?: string;
    limit?: number;
  }): Promise<ReportExecution[]> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, String(value));
      });
    }
    const query = searchParams.toString();
    return this.request<ReportExecution[]>(`/scheduled-reports/executions/recent${query ? `?${query}` : ''}`);
  }
}

export const api = new ApiClient();
