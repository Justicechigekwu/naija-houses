import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnReconnect: true,
      staleTime: 1000 * 30,
    },
    mutations: {
      retry: 0,
    },
  },
});