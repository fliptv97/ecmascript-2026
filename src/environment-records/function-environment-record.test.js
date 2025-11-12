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
      const f = new Function_();
      f.thisMode = FunctionThisMode.STRICT;

      const thisValue = {};
      const envRec = new FunctionEnvironmentRecord(f);
      const opResult = envRec.bindThisValue(thisValue);

      assert(opResult instanceof CompletionRecord);
      assert(opResult.type == CompletionRecordType.NORMAL);
      assert(opResult.value === UNUSED);

      assert(envRec.thisValue == thisValue);
    });
  });
});
