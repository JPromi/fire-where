import Constants from "expo-constants";
import { NativeModules, Platform } from "react-native";

export function getBuildVersion(): string {
  const configExtra = Constants.expoConfig?.extra;
  // Expo Go and older app binaries may not include RNDeviceInfo. Importing the
  // library in those environments creates a NativeEventEmitter and crashes iOS.
  const hasDeviceInfo =
    Platform.OS !== "web" && NativeModules.RNDeviceInfo != null;
  const deviceInfo: typeof import("react-native-device-info").default | undefined =
    hasDeviceInfo
      // eslint-disable-next-line @typescript-eslint/no-require-imports -- Must only load when the native module exists.
      ? require("react-native-device-info").default
      : undefined;
  const version =
    deviceInfo?.getVersion() || configExtra?.buildVersion || Constants.expoConfig?.version;
  const buildNumber = deviceInfo?.getBuildNumber() || configExtra?.buildNumber;

  return `${version ?? ""}${buildNumber && buildNumber !== "unknown" ? ` (${buildNumber})` : ""}`;
}
