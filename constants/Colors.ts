/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#ffffff';
const opTextDark = '#FFFFFF';
const opTextLight = '#11181C';

export const Colors = {
  light: {
    text: '#11181C',
    textSub: '#AAAAAA',
    background: '#fff',
    backgroundForground: '#b3b4b530',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,

    mapColorNoActivity: '#b3b4b5',
    border: '#F0F1F3',

    opFire: '#ff0c0c',
    opFireText: opTextDark,
    opTechnical: '#0077ff',
    opTechnicalText: opTextDark,
    opChimical: '#65d82d',
    opChimicalText: opTextDark,
    opSupport: '#fc9e23',
    opSupportText: opTextDark,
    opOther: '#f5f5f5',
    opOtherText: opTextLight,
  },
  dark: {
    text: '#ECEDEE',
    textSub: '#888',
    background: '#151718',
    backgroundForground: '#88888850',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,

    mapColorNoActivity: '#2C2F32',
    border: '#202325',

    opFire: '#ff0c0c',
    opFireText: opTextDark,
    opTechnical: '#0077ff',
    opTechnicalText: opTextDark,
    opChimical: '#65d82d',
    opChimicalText: opTextDark,
    opSupport: '#fc9e23',
    opSupportText: opTextDark,
    opOther: '#f5f5f5',
    opOtherText: opTextLight,
  },
};
