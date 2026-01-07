import Constants from 'expo-constants';
import { IoTTransport } from './transport';
import { HttpTransport } from './httpTransport';
import { MqttTransport } from './mqttTransport';

export function getIoTTransport(): IoTTransport {
  const extra =
    (Constants?.manifest as any)?.extra ||
    (Constants as any).expoConfig?.extra ||
    {};
  const mode = (extra.iotMode as string) || 'http';
  if (mode === 'mqtt') {
    return new MqttTransport();
  }
  return new HttpTransport();
}