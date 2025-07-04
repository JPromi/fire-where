import { StyleProp, Text, View, ViewStyle } from "react-native";


export function ErrorMessage (
  {
    message,
    style = {},
    type = 'info',
  }: {
    message: string;
    style?: StyleProp<ViewStyle>;
    type?: 'ok' | 'error' | 'warning' | 'info';
  }
) {
  
  function getStyle(type: string): StyleProp<ViewStyle> {
    return null;
  }

  // return component
  if(message) {
    return (
      <View
        style={[
          {

          },
          style
        ]}>
          <Text>{message}</Text>
      </View>
    );
  }
}