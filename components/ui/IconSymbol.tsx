import * as fa from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { OpaqueColorValue, StyleProp, TextStyle } from 'react-native';

type IconSymbolName =
  | 'house.fill'
  | 'paperplane.fill'
  | 'chevron.left.forwardslash.chevron.right'
  | 'chevron.right'
  | 'gear'
  | 'map.fill'
  | 'checkmark'
  | 'list.bullet'
  | 'rectangle.grid.1x2'
  | 'chevron.down'
  | 'arrow.left'
  | 'arrow.right'
  | 'wave.3.right'
  | 'clipboard'
  | 'arrow.2.circlepath'
  | 'xmark'
  | 'heart.fill'
  | 'flame.fill'
  | 'globe';

const ICONS: Record<IconSymbolName, any> = {
  'house.fill': fa.faHouse,
  'paperplane.fill': fa.faPaperPlane,
  'chevron.left.forwardslash.chevron.right': fa.faCode,
  'chevron.right': fa.faChevronRight,
  'gear': fa.faGear,
  'map.fill': fa.faMap,
  'checkmark': fa.faCheck,
  'list.bullet': fa.faList,
  'rectangle.grid.1x2': fa.faBars,
  'chevron.down': fa.faChevronDown,
  'arrow.left': fa.faArrowLeft,
  'arrow.right': fa.faArrowRight,
  'wave.3.right': fa.faBell,
  'clipboard': fa.faClipboard,
  'arrow.2.circlepath': fa.faArrowRotateRight,
  'xmark': fa.faXmark,
  'heart.fill': fa.faHeart,
  'flame.fill': fa.faFire,
  'globe': fa.faGlobe,
};

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
}) {
  return (
    <FontAwesomeIcon icon={ICONS[name]} size={size - 5} color={color as string} style={{outline: 'none'}} />
  );
}
