import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function useDynamicSide() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions(); // triggert re-render bei Rotation

  return useMemo(() => {
    return {
      top: insets.top,
      right: insets.right,
      bottom: insets.bottom,
      left: insets.left,
    };
  }, [insets.bottom, width, height]);
}
