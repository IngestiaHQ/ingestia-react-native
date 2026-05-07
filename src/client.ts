import NativeIngestiaReactNative from './NativeIngestiaReactNative';
import type { IngestiaConfig } from './config';

export class IngestiaClient {
  constructor(config: IngestiaConfig) {
    NativeIngestiaReactNative.configure(
      config.apiKey,
      config.endpoint ?? 'http://localhost:50051',
      config.flushInterval ?? 5000,
      config.batchSize ?? 10
    );
  }

  initialize(): Promise<void> {
    return NativeIngestiaReactNative.initialize();
  }

  track(event: string, properties?: Record<string, unknown>): void {
    NativeIngestiaReactNative.track(event, JSON.stringify(properties ?? {}));
  }

  identify(alias: string, traits?: Record<string, unknown>): void {
    NativeIngestiaReactNative.identify(alias, JSON.stringify(traits ?? {}));
  }

  flush(): Promise<void> {
    return NativeIngestiaReactNative.flush();
  }

  destroy(): void {
    NativeIngestiaReactNative.destroy();
  }
}
