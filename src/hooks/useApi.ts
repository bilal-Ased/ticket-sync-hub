import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, Company, Ticket, TicketStats, ImportResult, ScheduledReport, ScheduledReportCreate, ScheduledReportUpdate, ReportExecution } from "@/lib/api";
import { toast } from "sonner";

// Companies
export const useCompanies = () => {
  return useQuery<Company[], Error>({
    queryKey: ["companies"],
    queryFn: () => api.getCompanies(),
  });
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Omit<Company, 'id' | 'is_active'>) => api.createCompany(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast.success("Company created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create company");
    },
  });
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => api.deleteCompany(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast.success("Company deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete company");
    },
  });
};

// Tickets
export const useTickets = (params?: {
  company_id?: number;
  status?: string;
  category?: string;
  date_start?: string;
  date_end?: string;
  search?: string;
  limit?: number;
  offset?: number;
}) => {
  return useQuery<Ticket[], Error>({
    queryKey: ["tickets", params],
    queryFn: () => api.getTickets(params),
  });
};

export const useTicketStats = (params?: {
  company_id?: number;
  date_start?: string;
  date_end?: string;
}) => {
  return useQuery<TicketStats, Error>({
    queryKey: ["ticketStats", params],
    queryFn: () => api.getTicketStats(params),
  });
};

// Import
export const useImportTickets = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ImportResult, Error, { 
    company_id: number; 
    date_start: string; 
    date_end?: string;
    send_email?: boolean;
    recipient_emails?: string[];
  }>({
    mutationFn: (data) => api.importTickets(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["ticketStats"] });
      let message = result.message;
      if (result.email_sent) {
        message += ` | Email sent to ${result.recipients?.length || 0} recipient(s)`;
      }
      toast.success(message);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Import failed");
    },
  });
};

// Scheduled Reports
export const useScheduledReports = (params?: {
  company_id?: number;
  is_active?: boolean;
}) => {
  return useQuery<ScheduledReport[], Error>({
    queryKey: ["scheduledReports", params],
    queryFn: () => api.getScheduledReports(params),
  });
};

export const useCreateScheduledReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ScheduledReport, Error, ScheduledReportCreate>({
    mutationFn: (data) => api.createScheduledReport(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduledReports"] });
      toast.success("Scheduled report created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create scheduled report");
    },
  });
};

export const useUpdateScheduledReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ScheduledReport, Error, { id: number; data: ScheduledReportUpdate }>({
    mutationFn: ({ id, data }) => api.updateScheduledReport(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduledReports"] });
      toast.success("Scheduled report updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update scheduled report");
    },
  });
};

export const useDeleteScheduledReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation<{ success: boolean; message: string }, Error, number>({
    mutationFn: (id) => api.deleteScheduledReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduledReports"] });
      toast.success("Scheduled report deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete scheduled report");
    },
  });
};

export const useExecuteScheduledReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation<{ success: boolean; message: string }, Error, number>({
    mutationFn: (id) => api.executeScheduledReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reportExecutions"] });
      toast.success("Report execution started");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to execute report");
    },
  });
};

export const useToggleScheduledReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ScheduledReport, Error, number>({
    mutationFn: (id) => api.toggleScheduledReport(id),
    onSuccess: (report) => {
      queryClient.invalidateQueries({ queryKey: ["scheduledReports"] });
      toast.success(report.is_active ? "Schedule enabled" : "Schedule paused");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to toggle schedule");
    },
  });
};

export const useReportExecutions = (scheduleId: number, params?: { limit?: number }) => {
  return useQuery<ReportExecution[], Error>({
    queryKey: ["reportExecutions", scheduleId, params],
    queryFn: () => api.getReportExecutions(scheduleId, params),
    enabled: !!scheduleId,
  });
};
