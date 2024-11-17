import { useQuery } from '@tanstack/react-query';
import { ProcessedFile } from '../models/process.file.model';

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface ApiResponse {
  data: ProcessedFile[];
  pagination: PaginationInfo;
}

// Query hook
export function useGetData(page: number = 1, itemsPerPage: number = 100) {
  return useQuery<ApiResponse>({
    queryKey: ['data', page, itemsPerPage],
    queryFn: async () => {
      const response = await fetch(
        `/api/data?page=${page}&itemsPerPage=${itemsPerPage}`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });
}


