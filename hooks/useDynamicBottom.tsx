import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function useDynamicBottom() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions(); // triggert re-render bei Rotation
  void width;
  void height;

  return insets.bottom;
}
