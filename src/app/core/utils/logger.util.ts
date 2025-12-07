import { environment } from '../../../environments/environment';

export function logDev(message: string, ...data: any[]): void {
  if (!environment.production) {
    console.log(`[DEV] ${message}`, ...data);
  }
}
