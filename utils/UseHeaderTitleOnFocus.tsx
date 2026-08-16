import { useFocusEffect, useNavigation } from "expo-router/react-navigation";
import { useCallback } from "react";
import * as titleFunction from "./TitleFunction";

type HeaderNavigation = {
  setOptions: (options: { title?: string }) => void;
};

export function useHeaderTitleOnFocus(title?: string | null) {
  const navigation = useNavigation<HeaderNavigation>();

  useFocusEffect(
    useCallback(() => {
      titleFunction.title(title || undefined);
      
      if (title) {
        navigation.setOptions({ title });
      }
    }, [navigation, title])
  );
}
