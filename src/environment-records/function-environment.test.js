import assert from "node:assert";
import { describe, it } from "node:test";
import { Completion, Type as CompletionType } from "../completion.js";
import { UNUSED } from "../constants.js";
import { Function_, ThisMode as FunctionThisMode } from "../stubs/function.js";
import { FunctionEnvironment } from "./function-environment.js";

describe("FunctionEnvironment", () => {
  describe("bindThisValue", () => {
    it('should properly bind "this" value', () => {
      const fn = new Function_();
      fn.thisMode = FunctionThisMode.STRICT;

      const thisValue = {};
      const envRec = new FunctionEnvironment(fn);
      const opResult = envRec.bindThisValue(thisValue);

      assert(opResult instanceof Completion);
      assert(opResult.type == CompletionType.NORMAL);
      assert(opResult.value === UNUSED);

      assert(envRec.thisValue == thisValue);
    });

    it("should throw an error if 'this' is already bound", () => {
      const f = new Function_();
      f.thisMode = FunctionThisMode.STRICT;

      const envRec = new FunctionEnvironment(f);
      envRec.bindThisValue({});
      const opResult = envRec.bindThisValue({});

      assert(opResult instanceof Completion);
      assert(opResult.type == CompletionType.THROW);
      assert(opResult.value instanceof ReferenceError);
    });
  });

  it('should properly implement "hasThisBinding"', () => {
    const cases = [
      {
        functionThisMode: FunctionThisMode.LEXICAL,
        expected: false,
      },
      {
        functionThisMode: FunctionThisMode.STRICT,
        expected: true,
      },
    ];

    for (let { functionThisMode, expected } of cases) {
      const fn = new Function_();
      fn.thisMode = functionThisMode;

      const envRec = new FunctionEnvironment(fn);
      const opResult = envRec.hasThisBinding();

      assert(opResult instanceof Completion);
      assert(opResult.type == CompletionType.NORMAL);
      assert(opResult.value === expected);
    }
  });

  it('should properly implement "hasSuperBinding"', () => {
    const testCases = [
      {
        functionThisMode: FunctionThisMode.LEXICAL,
        functionHomeObject: undefined,
        expected: false,
      },
      {
        functionThisMode: FunctionThisMode.STRICT,
        functionHomeObject: undefined,
        expected: false,
      },
      {
        functionThisMode: FunctionThisMode.STRICT,
        functionHomeObject: {},
        expected: true,
      },
    ];

    for (let { functionThisMode, functionHomeObject, expected } of testCases) {
      const fn1 = new Function_();
      fn1.thisMode = functionThisMode;
      fn1.homeObject = functionHomeObject;

      const envRec = new FunctionEnvironment(fn1);
      const opResult = envRec.hasSuperBinding();

      assert(opResult instanceof Completion);
      assert(opResult.type == CompletionType.NORMAL);
      assert(opResult.value === expected);
    }
  });
});
