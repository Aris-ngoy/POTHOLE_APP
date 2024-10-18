"use client";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { FC, useState } from "react";

//Cache https requests
const ReactQueryProvider : FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
export default ReactQueryProvider;