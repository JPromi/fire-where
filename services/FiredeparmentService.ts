import { CONFIG } from '@/constants/Config';
import { Firedepartment } from '@/models/Firedepartment';
import axios from 'axios';

export class FiredepartmentService {
  static async getFiredepartmentByUuid(uuid: string) {
    const res = await axios.get<Firedepartment>(`${CONFIG.api.baseUrl}/firedepartment/${uuid}`);
    return res.data;
  }
}
