import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, Company, Ticket, TicketStats, ImportResult } from "@/lib/api";
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
  
  return useMutation<ImportResult, Error, { company_id: number; date_start: string; date_end?: string }>({
    mutationFn: (data) => api.importTickets(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["ticketStats"] });
      toast.success(result.message);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Import failed");
    },
  });
};
