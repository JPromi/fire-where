type SettingValue = string | boolean | undefined;

class SettingsLocalService {
  private settings: Record<string, SettingValue> = {};
  private listeners: Set<() => void> = new Set();

  get(key: string): SettingValue {
    return this.settings[key];
  }

  set(key: string, value: SettingValue) {
    this.settings[key] = value;
    this.notify();
  }

  getAll(): Record<string, SettingValue> {
    return { ...this.settings };
  }

  subscribe(callback: () => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback); // unsubscribe
  }

  private notify() {
    for (const cb of this.listeners) {
      cb();
    }
  }
}

export const settingsLocalService = new SettingsLocalService();
