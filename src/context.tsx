import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { IngestiaClient } from './client';

const IngestiaContext = createContext<IngestiaClient | null>(null);

export function IngestiaProvider({
  client,
  children,
}: {
  client: IngestiaClient;
  children: ReactNode;
}) {
  return (
    <IngestiaContext.Provider value={client}>
      {children}
    </IngestiaContext.Provider>
  );
}

export function useIngestiaClient(): IngestiaClient {
  const client = useContext(IngestiaContext);
  if (!client)
    throw new Error('useIngestia must be used within <IngestiaProvider>');
  return client;
}
