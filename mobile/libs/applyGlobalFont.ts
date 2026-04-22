import { Text, TextInput } from "react-native";

let applied = false;

export function applyGlobalFont() {
  if (applied) return;
  applied = true;

  const TextAny = Text as any;
  const TextInputAny = TextInput as any;

  const oldTextRender = TextAny.render;
  const oldTextInputRender = TextInputAny.render;

  TextAny.render = function (...args: any[]) {
    const origin = oldTextRender.apply(this, args);

    return {
      ...origin,
      props: {
        ...origin.props,
        allowFontScaling: false,
        style: [{ fontFamily: "Inter_400Regular" }, origin.props.style],
      },
    };
  };

  TextInputAny.render = function (...args: any[]) {
    const origin = oldTextInputRender.apply(this, args);

    return {
      ...origin,
      props: {
        ...origin.props,
        allowFontScaling: false,
        style: [{ fontFamily: "Inter_400Regular" }, origin.props.style],
      },
    };
  };
}