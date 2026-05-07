import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AppState,
  type AppStateStatus,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  IngestiaClient,
  IngestiaProvider,
  useIdentify,
  useIngestia,
  useTrack,
} from '@ingestia/react-native';

const client = new IngestiaClient({
  apiKey:
    'bev_3091f4c1aae67bc499807f91f7fba1603e0b2485aa51f9f376a58520d305ac2a',
  endpoint: 'http://localhost:50051',
});

export default function App() {
  return (
    <IngestiaProvider client={client}>
      <DemoScreen />
    </IngestiaProvider>
  );
}

function DemoScreen() {
  const ingestia = useIngestia();
  const track = useTrack();
  const identify = useIdentify();

  const [log, setLog] = useState<string[]>([]);
  const [alias, setAlias] = useState('');

  const sessionStartRef = useRef(Date.now());
  const backgroundStartRef = useRef(0);

  const append = useCallback((entry: string) => {
    setLog((prev) => [...prev, entry]);
  }, []);

  const doTrack = useCallback(
    (name: string, props?: Record<string, unknown>) => {
      track(name, props);
      if (props && Object.keys(props).length > 0) {
        const pairs = Object.entries(props)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ');
        append(`→ ${name} {${pairs}}`);
      } else {
        append(`→ ${name}`);
      }
    },
    [track, append]
  );

  useEffect(() => {
    ingestia.initialize().then(() => {
      sessionStartRef.current = Date.now();
      doTrack('app_open', { source: 'launcher' });
      doTrack('session_start');
    });

    const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'background') {
        backgroundStartRef.current = Date.now();
      } else if (state === 'active' && backgroundStartRef.current > 0) {
        const duration = Math.round(
          (Date.now() - backgroundStartRef.current) / 1000
        );
        doTrack('app_background', { duration });
        backgroundStartRef.current = 0;
      }
    });

    return () => {
      sub.remove();
      ingestia.flush().finally(() => ingestia.destroy());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>Ingestia Demo</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <SectionHeader title="Auth" />
        <Row>
          <EventButton
            label="login"
            onPress={() => doTrack('login', { method: 'email' })}
          />
          <EventButton label="logout" onPress={() => doTrack('logout')} />
        </Row>
        <Row>
          <EventButton
            label="sign_up"
            onPress={() => doTrack('sign_up', { method: 'email' })}
          />
          <EventButton
            label="password_reset"
            onPress={() => doTrack('password_reset')}
          />
        </Row>

        <SectionHeader title="Identify" />
        <TextInput
          style={styles.input}
          placeholder="Alias (email, userId…)"
          placeholderTextColor="#999"
          value={alias}
          onChangeText={setAlias}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={[
            styles.btn,
            styles.btnPrimary,
            !alias.trim() && styles.btnDisabled,
          ]}
          onPress={() => {
            if (!alias.trim()) return;
            identify(alias.trim(), { plan: 'pro' });
            append(`→ identify("${alias.trim()}")`);
          }}
          disabled={!alias.trim()}
        >
          <Text style={styles.btnPrimaryText}>identify</Text>
        </TouchableOpacity>

        <SectionHeader title="Push" />
        <Row>
          <EventButton
            label="received"
            onPress={() =>
              doTrack('push_notification_received', {
                campaign_id: 'camp_001',
                title: 'New offer!',
              })
            }
          />
          <EventButton
            label="opened"
            onPress={() =>
              doTrack('push_notification_opened', {
                campaign_id: 'camp_001',
                title: 'New offer!',
              })
            }
          />
        </Row>

        <SectionHeader title="Navigation" />
        <EventButton
          label="deep_link_opened"
          fullWidth
          onPress={() =>
            doTrack('deep_link_opened', { url: 'ingestia://home?ref=qr' })
          }
        />

        <SectionHeader title="E-commerce" />
        <Row>
          <EventButton
            label="product_viewed"
            onPress={() =>
              doTrack('product_viewed', {
                product_id: 'prod_42',
                name: 'Demo Ürün',
                price: 99.99,
              })
            }
          />
          <EventButton
            label="add_to_cart"
            onPress={() =>
              doTrack('add_to_cart', { product_id: 'prod_42', quantity: 1 })
            }
          />
        </Row>
        <Row>
          <EventButton
            label="checkout"
            onPress={() =>
              doTrack('checkout_started', { total: 99.99, currency: 'TRY' })
            }
          />
          <EventButton
            label="order ✓"
            onPress={() =>
              doTrack('order_completed', {
                order_id: 'ord_999',
                total: 99.99,
                currency: 'TRY',
              })
            }
          />
        </Row>

        <SectionHeader title="UI Events" />
        <Row>
          <EventButton
            label="click"
            onPress={() =>
              doTrack('click', { element: 'Button', text: 'Submit' })
            }
          />
          <EventButton
            label="app_crash"
            onPress={() =>
              doTrack('app_crash', {
                message: 'Simulated crash for demo',
                stack: 'DemoScreen → simulate()',
              })
            }
          />
        </Row>

        <View style={styles.divider} />

        <TouchableOpacity
          style={[styles.btn, styles.btnPrimary]}
          onPress={() => ingestia.flush().then(() => append('✓ flush()'))}
        >
          <Text style={styles.btnPrimaryText}>Flush</Text>
        </TouchableOpacity>

        <SectionHeader title="Event Log" />
        {log.length === 0 ? (
          <Text style={styles.logEmpty}>No events yet</Text>
        ) : (
          [...log].reverse().map((entry, i) => (
            <Text key={i} style={styles.logEntry}>
              {entry}
            </Text>
          ))
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionHeader}>{title.toUpperCase()}</Text>;
}

function Row({ children }: { children: React.ReactNode }) {
  return <View style={styles.row}>{children}</View>;
}

function EventButton({
  label,
  onPress,
  fullWidth,
}: {
  label: string;
  onPress: () => void;
  fullWidth?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.btn, styles.btnOutline, fullWidth && styles.fullWidth]}
      onPress={onPress}
    >
      <Text
        style={styles.btnOutlineText}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const BLUE = '#007AFF';

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  header: {
    paddingTop: Platform.OS === 'ios' ? 56 : 24,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  title: { fontSize: 17, fontWeight: '600', textAlign: 'center' },
  scroll: { flex: 1 },
  scrollContent: { padding: 16 },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '600',
    color: BLUE,
    marginTop: 12,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  row: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  btn: {
    flex: 1,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  btnPrimary: { backgroundColor: BLUE },
  btnPrimaryText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  btnOutline: { borderWidth: 1, borderColor: BLUE },
  btnOutlineText: { color: BLUE, fontSize: 11, fontWeight: '500' },
  btnDisabled: { opacity: 0.4 },
  fullWidth: { flex: 0, width: '100%' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    marginBottom: 6,
    color: '#000',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#ddd',
    marginVertical: 8,
  },
  logEmpty: { fontSize: 12, color: '#999', fontStyle: 'italic' },
  logEntry: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#555',
    marginBottom: 2,
  },
});
