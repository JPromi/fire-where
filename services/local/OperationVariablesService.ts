import { Colors } from "@/constants/Colors";
import { ColorSchemeName } from "react-native";

export class OperationVariablesService {
  static getOperationTypeColor(operationType: string, colorScheme: ColorSchemeName): string {
    switch (operationType) {
      case 'B':
        return Colors[colorScheme ?? 'light'].opFire;
      case 'T':
      case 'V':
        return Colors[colorScheme ?? 'light'].opTechnical;
      case 'G':
      case 'S':
        return Colors[colorScheme ?? 'light'].opChimical;
      case 'SOF':
        return Colors[colorScheme ?? 'light'].opSupport;
      default:
        return Colors[colorScheme ?? 'light'].opOther;
    }
  }

  static getOperationTypeTextColor(operationType: string, colorScheme: ColorSchemeName): string {
    switch (operationType) {
      case 'B':
        return Colors[colorScheme ?? 'light'].opFireText;
      case 'T':
      case 'V':
        return Colors[colorScheme ?? 'light'].opTechnicalText;
      case 'G':
      case 'S':
        return Colors[colorScheme ?? 'light'].opChimicalText;
      case 'SOF':
        return Colors[colorScheme ?? 'light'].opSupportText;
      default:
        return Colors[colorScheme ?? 'light'].opOtherText;
    }
  }
}