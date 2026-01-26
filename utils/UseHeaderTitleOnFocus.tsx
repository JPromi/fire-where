import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback } from "react";
import * as titleFunction from "./TitleFunction";

export function useHeaderTitleOnFocus(title?: string | null) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  useFocusEffect(
    useCallback(() => {
      titleFunction.title(title || undefined);
      
      if (title) {
        navigation.setOptions({ title });
      }
    }, [navigation, title])
  );
}