import { CONFIG } from '@/constants/Config';
import { Firedepartment } from '@/models/Firedepartment';
import axios from 'axios';

export class FiredepartmentService {
  static async getFiredepartmentByUuid(uuid: string) {
    const res = await axios.get<Firedepartment>(`${CONFIG.api.baseUrl}/firedepartment/${uuid}`);
    return res.data;
  }

  static async searchFiredepartments(q: string, limit: number = 20, page: number = 1) {
    const res = await axios.get<Firedepartment[]>(`${CONFIG.api.baseUrl}/firedepartment/list`, {
      params: {
        q,
        limit,
        page,
      },
    });
    return res.data;
  }
}
