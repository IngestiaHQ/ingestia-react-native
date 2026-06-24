# @ingestia/react-native

React Native SDK for [Ingestia](https://ingestia.dev) — behavioral event analytics.

## Requirements

- React Native 0.74+
- iOS 15+
- Android API 24+

## Installation

```sh
npm install @ingestia/react-native
# or
yarn add @ingestia/react-native
```

### iOS

```sh
cd ios && pod install
```

### Android

No additional steps required.

## Setup

Create a client and wrap your app with `IngestiaProvider`:

```tsx
import { IngestiaClient, IngestiaProvider } from '@ingestia/react-native';

const client = new IngestiaClient({
  apiKey: 'your-api-key',
  endpoint: 'https://your-ingestia-backend:50051',
});

export default function App() {
  return (
    <IngestiaProvider client={client}>
      <YourApp />
    </IngestiaProvider>
  );
}
```

## Usage

Use `useIngestia()` anywhere inside `IngestiaProvider`:

```tsx
import { useIngestia } from '@ingestia/react-native';

function HomeScreen() {
  const { track, identify, initialize, flush, destroy } = useIngestia();

  useEffect(() => {
    initialize();
  }, []);

  return (
    <Button
      title="Buy"
      onPress={() => track('purchase_clicked', { item: 'pro_plan' })}
    />
  );
}
```

## API

### `IngestiaClient`

```ts
new IngestiaClient(config: IngestiaConfig)
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | `string` | required | Project API key |
| `endpoint` | `string` | `http://localhost:50051` | Backend gRPC endpoint |
| `flushInterval` | `number` | `5000` | Auto-flush interval in ms |
| `batchSize` | `number` | `10` | Events per batch before auto-flush |

### `useIngestia()`

Returns an object with the following methods:

| Method | Signature | Description |
|--------|-----------|-------------|
| `initialize` | `() => Promise<void>` | Load or generate anonymous user ID, send identify event |
| `track` | `(event: string, properties?: Record<string, unknown>) => void` | Queue a track event |
| `identify` | `(userId: string, traits?: Record<string, unknown>) => void` | Queue an identify event |
| `flush` | `() => Promise<void>` | Flush queued events immediately |
| `destroy` | `() => void` | Stop auto-flush timer |

### `useIngestiaClient()`

Returns the raw `IngestiaClient` instance for direct access:

```tsx
import { useIngestiaClient } from '@ingestia/react-native';

const client = useIngestiaClient();
```

## License

MIT
