import { CONFIG } from "@/constants/Config";
import { Platform } from "react-native";

//export const title = (text: string | undefined) => Platform.select({ web: `${text}`, default: text });

export function title(text: string | undefined | null) {
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    let _title = "";
    _title += text ? text : "";
    _title += CONFIG.informations.app.name && text ? ` | ${CONFIG.informations.app.name}` : "";
    _title += CONFIG.informations.app.name && !text ? CONFIG.informations.app.name : "";
    document.title = _title;
  }
  return text || undefined;
}
