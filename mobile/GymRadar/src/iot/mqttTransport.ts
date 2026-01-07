import { IoTTransport } from './transport';
import Constants from 'expo-constants';

/**
 * Placeholder for a real MQTT/WebSocket transport.
 * Choose a client compatible with React Native WebSocket (e.g. paho-mqtt).
 *
 * - Connect to MQTT_URL from app.config.ts (env)
 * - Publish messages to topics your backend/broker subscribes to
 * - The app uses this via the IoTTransport interface so the UI doesn't change
 */
export class MqttTransport implements IoTTransport {
  private mqttUrl: string;

  constructor() {
    const extra =
      (Constants?.manifest as any)?.extra ||
      (Constants as any).expoConfig?.extra ||
      {};
    this.mqttUrl = extra.mqttUrl || '';
  }

  async ensureConnected(): Promise<void> {
    // TODO: Implement connection and session management
    // Example with paho: create client, connect with ws, handle callbacks.
    return;
  }

  async checkIn(): Promise<void> {
    await this.ensureConnected();
    // TODO: publish check-in event
    // e.g., client.publish('gym/checkin', JSON.stringify({ gymId, at: new Date().toISOString() }))
  }

  async checkOut(): Promise<void> {
    await this.ensureConnected();
    // TODO: publish check-out event
  }

  async sendTemperature(celsius: number): Promise<void> {
    await this.ensureConnected();
    // TODO: publish telemetry event
  }
}