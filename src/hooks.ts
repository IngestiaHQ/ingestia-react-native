import { useMemo } from 'react';
import { useIngestiaClient } from './context';

export function useIngestia() {
  const client = useIngestiaClient();
  return useMemo(
    () => ({
      track: (event: string, properties?: Record<string, unknown>) =>
        client.track(event, properties),
      identify: (userId: string, traits?: Record<string, unknown>) =>
        client.identify(userId, traits),
      initialize: () => client.initialize(),
      flush: () => client.flush(),
      destroy: () => client.destroy(),
    }),
    [client]
  );
}
