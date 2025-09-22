import { Colors } from "@/constants/Colors";
import { ColorSchemeName } from "react-native";

export class OperationVariablesService {
  static getOperationTypeColor(operationType: string, colorScheme: ColorSchemeName): string {
    switch (operationType) {
      case 'B':
      case 'BMA':
      case 'F':
        return Colors[colorScheme ?? 'light'].opFire;
      case 'T':
      case 'V':
      case 'KL':
        return Colors[colorScheme ?? 'light'].opTechnical;
      case 'G':
      case 'S':
        return Colors[colorScheme ?? 'light'].opChimical;
      case 'SOF':
      case 'SD':
        return Colors[colorScheme ?? 'light'].opSupport;
      default:
        return Colors[colorScheme ?? 'light'].opOther;
    }
  }

  static getOperationTypeTextColor(operationType: string, colorScheme: ColorSchemeName): string {
    switch (operationType) {
      case 'B':
      case 'BMA':
      case 'F':
        return Colors[colorScheme ?? 'light'].opFireText;
      case 'T':
      case 'V':
      case 'KL':
        return Colors[colorScheme ?? 'light'].opTechnicalText;
      case 'G':
      case 'S':
        return Colors[colorScheme ?? 'light'].opChimicalText;
      case 'SOF':
      case 'SD':
        return Colors[colorScheme ?? 'light'].opSupportText;
      default:
        return Colors[colorScheme ?? 'light'].opOtherText;
    }
  }

  static getOperationCategoryColorTyrol(operationCategory: string, colorScheme: ColorSchemeName): string {
    switch (operationCategory) {
      case 'BRANDG':
      case 'BRANDK':
      case 'EXPLOSION':
      case 'BMA':
      case 'BSW':
        return Colors[colorScheme ?? 'light'].opFire;
      case 'TECHNIK':
      case 'VERKEHR':
      case 'WASSER':
      case 'EINSTURZ':
      case 'RETTUNG':
      case 'BAHN':
      case 'FLUG':
      case 'STROM':
        return Colors[colorScheme ?? 'light'].opTechnical;
      case 'ÖL':
      case 'ABC':
      case 'GAS':
        return Colors[colorScheme ?? 'light'].opChimical;
      case 'UNTERSTÜTZUNG':
        return Colors[colorScheme ?? 'light'].opSupport;
      default:
        return Colors[colorScheme ?? 'light'].opOther;
    }
  }

  static getOperationCategoryTextColorTyrol(operationCategory: string, colorScheme: ColorSchemeName): string {
    switch (operationCategory) {
      case 'BRANDG':
      case 'BRANDK':
      case 'EXPLOSION':
      case 'BMA':
      case 'BSW':
        return Colors[colorScheme ?? 'light'].opFireText;
      case 'TECHNIK':
      case 'VERKEHR':
      case 'WASSER':
      case 'EINSTURZ':
      case 'RETTUNG':
      case 'BAHN':
      case 'FLUG':
      case 'STROM':
        return Colors[colorScheme ?? 'light'].opTechnicalText;
      case 'ÖL':
      case 'ABC':
      case 'GAS':
        return Colors[colorScheme ?? 'light'].opChimicalText;
      case 'UNTERSTÜTZUNG':
        return Colors[colorScheme ?? 'light'].opSupportText;
      default:
        return Colors[colorScheme ?? 'light'].opOtherText;
    }
  }
}