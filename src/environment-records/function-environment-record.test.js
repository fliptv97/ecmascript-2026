import { describe, it } from "node:test";
import assert from "node:assert";
import {
  CompletionRecord,
  Type as CompletionRecordType,
} from "../completion-record.js";
import { Function_, ThisMode as FunctionThisMode } from "../stubs/function.js";
import { FunctionEnvironmentRecord } from "./function-environment-record.js";
import { UNUSED } from "../constants.js";

describe("Function Environment Record", () => {
  describe("bindThisValue", () => {
    it('should properly bind "this" value', () => {
      const fn = new Function_();
      fn.thisMode = FunctionThisMode.STRICT;

      const thisValue = {};
      const envRec = new FunctionEnvironmentRecord(fn);
      const opResult = envRec.bindThisValue(thisValue);

      assert(opResult instanceof CompletionRecord);
      assert(opResult.type == CompletionRecordType.NORMAL);
      assert(opResult.value === UNUSED);

      assert(envRec.thisValue == thisValue);
    });

    it("should throw an error if 'this' is already bound", () => {
      const f = new Function_();
      f.thisMode = FunctionThisMode.STRICT;

      const envRec = new FunctionEnvironmentRecord(f);
      envRec.bindThisValue({});
      const opResult = envRec.bindThisValue({});

      assert(opResult instanceof CompletionRecord);
      assert(opResult.type == CompletionRecordType.THROW);
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

      const envRec = new FunctionEnvironmentRecord(fn);
      const opResult = envRec.hasThisBinding();

      assert(opResult instanceof CompletionRecord);
      assert(opResult.type == CompletionRecordType.NORMAL);
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

      const envRec = new FunctionEnvironmentRecord(fn1);
      const opResult = envRec.hasSuperBinding();

      assert(opResult instanceof CompletionRecord);
      assert(opResult.type == CompletionRecordType.NORMAL);
      assert(opResult.value === expected);
    }
  });
});
