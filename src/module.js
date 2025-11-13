// https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-abstract-module-records
export class Module {
  #environment;

  constructor(environment) {
    this.#environment = environment;
  }

  get environment() {
    return this.#environment;
  }
}
