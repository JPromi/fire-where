import { GrisuState } from "@/dtos/GrisuState.dto";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export class LaInfoscreenService {
  private static readonly BASE_URL = `https://infoscreen.florian10.info/ows/infoscreen`;
  // on web the browser manages the session cookies set by the server
  private static readonly IS_WEB = Platform.OS === "web";

  static async getActiveOperations() {
    const res = await axios.get<GrisuState>(
      `${this.BASE_URL}/einsatz.ashx`,
      {
        headers: {
          ...await this.setCookieRequest()
        },
        withCredentials: this.IS_WEB,
      }
    );
    if (res.status == 200) {
      return await this.handleResponse(res.data, res.headers["set-cookie"]?.[0]);
    }
  }

  static async getHistoryOperations() {
    const res = await axios.get<GrisuState>(
      `${this.BASE_URL}/historic.ashx`,
      {
        headers: {
          ...await this.setCookieRequest()
        },
        withCredentials: this.IS_WEB,
      }
    );

    if (res.status == 200) {
      return await this.handleResponse(res.data, res.headers["set-cookie"]?.[0]);
    }
  }

  static async getLoginState() {
    const res = await axios.get<GrisuState>(
      `${this.BASE_URL}/einsatz.ashx`,
      {
        headers: {
          ...await this.setCookieRequest()
        },
        withCredentials: this.IS_WEB,
      }
    );
    if (res.status == 200) {
      return await this.handleResponse(res.data, res.headers["set-cookie"]?.[0]);
    }
  }

  // Access code management
  private static async getAccessCode() {
    const accessCode = await SecureStore.getItemAsync("laInfoscreenAccessCode");
    if (!accessCode) {
      throw new Error("Access code not found");
    }
    return accessCode;
  }

  private static async setAccessCode(accessCode: string) {
    if (this.IS_WEB) return;
    await SecureStore.setItemAsync("laInfoscreenAccessCode", accessCode);
  }

  private static async removeAccessCode() {
    if (this.IS_WEB) return;
    await SecureStore.deleteItemAsync("laInfoscreenAccessCode");
  }

  // Access token management
  private static async getAccessToken() {
    const accessToken = await SecureStore.getItemAsync("laInfoscreenAccessToken");
    if (!accessToken) {
      throw new Error("Access token not found");
    }
    return accessToken;
  }

  private static async setAccessToken(accessToken: string) {
    if (this.IS_WEB) return;
    await SecureStore.setItemAsync("laInfoscreenAccessToken", accessToken);
  }

  private static async removeAccessToken() {
    if (this.IS_WEB) return;
    await SecureStore.deleteItemAsync("laInfoscreenAccessToken");
  }

  // Handling
  static async setCookieRequest(): Promise<{ Cookie: string } | null> {
    if (this.IS_WEB) return null;

    try {
      const accessToken = await this.getAccessToken();

      return {
        Cookie: `xFFK_InfoScrCookie_SessionID=${accessToken}`,
      };
    } catch (error) {
      try {
        const accessCode = await this.getAccessCode();

        return {
          Cookie: `xFFK_InfoScrCookie_TokenID=${accessCode}`,
        };
      } catch (error) {
        return null;
      }
    }
  }

  static async handleResponse(grisuState: GrisuState, cookies: string | undefined): Promise<GrisuState> {
    if (grisuState.CurrentState == "data") {
      // set access token
      if (cookies) {
        const _cookies = cookies.split(",").map(cookie => cookie.trim());
        const accessTokenCookie = _cookies.find(cookie => cookie.startsWith("xFFK_InfoScrCookie_SessionID="));
        
        const accessToken = accessTokenCookie
          ?.slice("xFFK_InfoScrCookie_SessionID=".length)
          .split(";")[0];
        
        if (accessToken) {
          await this.setAccessToken(accessToken);
        }
      }

      return grisuState;
    } else if (grisuState.CurrentState == "waiting" || grisuState.CurrentState == "token") {
      // not logged in
      
      // set access code
      if (grisuState.Token) {
        await this.setAccessCode(grisuState.Token);
      }

      // response
      return grisuState;
    } else if (grisuState.CurrentState == "error") {
      throw new Error(`Error state: ${grisuState.Errors?.ErrorMsg ?? "Unknown error"}`);
    } else {
      throw new Error(`Unknown state: ${grisuState.CurrentState}`);
    }
  }
}
