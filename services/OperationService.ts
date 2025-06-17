import { CONFIG } from '@/constants/Config';
import { Operation } from '@/models/Operation';
import axios from 'axios';

export class OperationService {
  static async getOperationsByFs(federalStateId: string) {
    const res = await axios.get<Operation[]>(`${CONFIG.api.baseUrl}/operation/list/${federalStateId}`);
    return Array.isArray(res.data) ? res.data : [];
  }

  static async getOperationsByFsDistrict(federalStateId: string, districtId: string) {
    const res = await axios.get<Operation[]>(`${CONFIG.api.baseUrl}/operation/list/${federalStateId}`, {
      params: { district: districtId },
    });
    return Array.isArray(res.data) ? res.data : [];
  }

  static async getOperation(uuid: string) {
    const res = await axios.get<Operation>(`${CONFIG.api.baseUrl}/operation/${uuid}`);
    return res.data;
  }
}
