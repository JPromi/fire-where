import { CONFIG } from '@/constants/Config';
import { LocationStatistic } from '@/models/LocationStatistic';
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

  static async getStatistic() {
    const res = await axios.get<LocationStatistic[]>(`${CONFIG.api.baseUrl}/operation/list/statistic`);
    return res.data;
  }

  static async getStatisticFromFederalStates(federalState: string) {
    const res = await axios.get<LocationStatistic[]>(`${CONFIG.api.baseUrl}/operation/list/${federalState}/statistic`);
    return res.data;
  }
}
