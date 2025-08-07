import { OperationVariablesService } from "@/services/local/OperationVariablesService";
import { Text, useColorScheme, View } from "react-native";

export function OperationTypeView({
  alarm,
  size,
}: {
  alarm: {
    type?: string;
    level?: number;
    levelAddition?: string;
    message?: string;
    upperAustriaId?: string;
    upperAustriaType?: string;
    tyrolOrganization?: string;
    tyrolOutOrder?: string;
    tyrolCategory?: string;
  },
  size?: 'list' | 'detail';
}) {
  const colorScheme = useColorScheme();

  if(alarm?.level?.toString() || alarm?.type || alarm?.levelAddition) {
    // B2T
    return (
      <View
        style={{
          backgroundColor: OperationVariablesService.getOperationTypeColor(alarm.type || '', colorScheme),
          width: size == 'list' ? 45 : 64,
          height: size == 'list' ? 45 : 64,
          borderRadius: size == 'list' ? 3 : 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            color: OperationVariablesService.getOperationTypeTextColor(alarm.type || '', colorScheme),
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize:
              `${alarm.type || ''}${alarm.level?.toString() || ''}${alarm.levelAddition || ''}`.length <= 2 ?
                (size == 'list' ? 18 : 28) :
                (size == 'list' ? 11 : 15),
          }}>{alarm.type}{alarm.level}{alarm.levelAddition}</Text>
      </View>
    );
  }

  if(alarm?.tyrolCategory) {
    // FW-A-BRANDG
    return (
      <View
        style={{
          backgroundColor: OperationVariablesService.getOperationCategoryColorTyrol(alarm?.tyrolCategory || '', colorScheme),
          width: size == 'list' ? 100 : 120,
          height: size == 'list' ? 45 : 52,
          borderRadius: size == 'list' ? 3 : 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 4,
        }}>
          {size == 'detail' && alarm?.tyrolOrganization ? (
            <Text
              style={{
                color: OperationVariablesService.getOperationCategoryTextColorTyrol(alarm.tyrolCategory || '', colorScheme),
                fontWeight: 'semibold',
                fontSize: 14,
              }}>{`${alarm?.tyrolOutOrder}`}</Text>
          ) : null}
          <Text
            style={{
              color: OperationVariablesService.getOperationCategoryTextColorTyrol(alarm?.tyrolCategory || '', colorScheme),
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize:
                (alarm?.tyrolCategory?.length ?? 0) >= 8 ?
                  (size == 'list' ? 12 : 16) :
                  (size == 'list' ? 18 : 20),
            }}>{`${alarm.tyrolCategory}`}</Text>
      </View>
    );
  }
}
