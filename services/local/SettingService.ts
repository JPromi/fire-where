import AsyncStorage from '@react-native-async-storage/async-storage';
import { settingsLocalService } from './SettingLocalService';

export class SettingService {

  static async getByKey(key: string): Promise<string | boolean | undefined> {
    try {
      const data = await AsyncStorage.getItem(`setting:${key}`);
      if (data === null) return undefined;
      if (data === 'true') return true;
      if (data === 'false') return false;
      return data;
    } catch (error) {
      console.error('AsyncStorage error:', error);
      return undefined;
    }
  }

  static async setByKey(key: string, value: string | boolean | null): Promise<void> {
    try {
      if (typeof value === 'boolean') {
        await AsyncStorage.setItem(`setting:${key}`, value ? 'true' : 'false');
        settingsLocalService.set(key, value ? 'true' : 'false');
      } else {
        await AsyncStorage.setItem(`setting:${key}`, value ? value : '');
        settingsLocalService.set(key, value ? value : undefined);
      }
    } catch (error) {
      console.error('AsyncStorage error:', error);
    }
  }
}