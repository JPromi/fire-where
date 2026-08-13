import { CONFIG } from "@/constants/Config";
import { ServiceStatus } from "@/models/ServiceStatus";
import { apiClient } from "./ApiClient";

export class ServiceService {
  static async getServices() {
    const res = await apiClient.get<ServiceStatus[]>(
      `${CONFIG.api.baseUrl}/status`,
    );
    return Array.isArray(res.data) ? res.data : [];
  }
}
