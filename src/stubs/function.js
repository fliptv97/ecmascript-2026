export const ThisMode = {
  GLOBAL: "GLOBAL",
  LEXICAL: "LEXICAL",
  STRICT: "STRICT",
};

export class Function_ extends Function {
  environment = null;
  homeObject = undefined;
  thisMode = ThisMode.LEXICAL;
}
