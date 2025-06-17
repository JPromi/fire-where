import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function useDynamicBottom() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions(); // triggert re-render bei Rotation

  return useMemo(() => {
    return insets.bottom;
  }, [insets.bottom, width, height]);
}
