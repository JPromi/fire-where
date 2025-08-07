import { CONFIG } from '@/constants/Config';
import { ServiceStatus } from '@/models/ServiceStatus';
import axios from 'axios';

export class ServiceService {
  static async getServices() {
    const res = await axios.get<ServiceStatus[]>(`${CONFIG.api.baseUrl}/status`);
    return Array.isArray(res.data) ? res.data : [];
  }
}
