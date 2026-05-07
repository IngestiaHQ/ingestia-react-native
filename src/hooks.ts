import { useCallback } from 'react';
import { useIngestiaClient } from './context';

export function useIngestia() {
  return useIngestiaClient();
}

export function useTrack() {
  const client = useIngestiaClient();
  return useCallback(
    (event: string, properties?: Record<string, unknown>) =>
      client.track(event, properties),
    [client]
  );
}

export function useIdentify() {
  const client = useIngestiaClient();
  return useCallback(
    (alias: string, traits?: Record<string, unknown>) =>
      client.identify(alias, traits),
    [client]
  );
}

export function useInitialize() {
  const client = useIngestiaClient();
  return useCallback(() => client.initialize(), [client]);
}
