import { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function useDynamicSide() {
  const insets = useSafeAreaInsets();

  return useMemo(() => {
    return {
      top: insets.top,
      right: insets.right,
      bottom: insets.bottom,
      left: insets.left,
    };
  }, [insets.top, insets.right, insets.bottom, insets.left]);
}
