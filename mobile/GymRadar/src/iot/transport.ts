export interface IoTTransport {
  checkIn(): Promise<void>;
  checkOut(): Promise<void>;
  sendTemperature(celsius: number): Promise<void>;
}