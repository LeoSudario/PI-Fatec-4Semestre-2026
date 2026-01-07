import { IoTTransport } from './transport';
import * as GymAPI from '../api/gym';

export class HttpTransport implements IoTTransport {
  async checkIn(): Promise<void> {
    await GymAPI.checkIn();
  }
  async checkOut(): Promise<void> {
    await GymAPI.checkOut();
  }
  async sendTemperature(celsius: number): Promise<void> {
    await GymAPI.sendTemperature(celsius);
  }
}