export const ThisMode = {
  GLOBAL: "GLOBAL",
  LEXICAL: "LEXICAL",
  STRICT: "STRICT",
} as const;

type TThisMode = keyof typeof ThisMode;

export class Function_ extends Function {
  environment = null;
  homeObject: Object | undefined = undefined;
  thisMode: TThisMode = ThisMode.LEXICAL;
}
