import { TurboModuleRegistry, type TurboModule } from 'react-native';

export interface Spec extends TurboModule {
  configure(
    apiKey: string,
    endpoint: string,
    flushInterval: number,
    batchSize: number
  ): void;
  initialize(): Promise<void>;
  track(event: string, propertiesJson: string): void;
  identify(alias: string, traitsJson: string): void;
  flush(): Promise<void>;
  destroy(): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('IngestiaReactNative');
