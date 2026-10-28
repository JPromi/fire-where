// services/ApiClient.ts
import { getBuildVersion } from "@/utils/BuildVersion";
import axios from "axios";
import { Platform } from "react-native";

export const apiClient = axios.create({
  headers: {
    "X-Fw-Version": getBuildVersion(),
    "X-Fw-Platform": Platform.OS,
  },
});

apiClient.interceptors.request.use(async (config) => {
  return config;
});
