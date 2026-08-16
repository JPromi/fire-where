// services/ApiClient.ts
import axios from "axios";
import Constants from "expo-constants";
import { Platform } from "react-native";

export const apiClient = axios.create({
  headers: {
    "X-Fw-Version": Constants.expoConfig?.version,
    "X-Fw-Platform": Platform.OS,
  },
});

apiClient.interceptors.request.use(async (config) => {
  return config;
});
