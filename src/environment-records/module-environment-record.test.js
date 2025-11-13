import assert from "node:assert";
import { describe, it } from "node:test";
import { CompletionRecord } from "../completion-record.js";
import { ModuleEnvironmentRecord } from "./module-environment-record.js";
import { Type as CompletionRecordType } from "../completion-record.js";
import { ModuleRecord } from "../module-record.js";

describe("ModuleEnvironmentRecord", () => {
  describe("getBindingValue", () => {
    it("should return bound value", () => {
      const envRec = new ModuleEnvironmentRecord(null);
      const name = "name";
      const value = "Philip";

      envRec.createImmutableBinding(name, true);
      envRec.initializeBinding(name, value);

      const opResult = envRec.getBindingValue(name, true);

      assert(opResult instanceof CompletionRecord);
      assert(opResult.type == CompletionRecordType.NORMAL);
      assert(opResult.value == value);
    });

    it("should return indirectly bound value", () => {
      const sourceEnvRec = new ModuleEnvironmentRecord(null);
      const sourceName = "name";
      const sourceValue = "Philip";

      sourceEnvRec.createImmutableBinding(sourceName, true);
      sourceEnvRec.initializeBinding(sourceName, sourceValue);

      const targetEnvRec = new ModuleEnvironmentRecord(null);
      const targetName = "targetName";
      const moduleRec = new ModuleRecord(sourceEnvRec);

      targetEnvRec.createImportBinding(targetName, moduleRec, sourceName);

      const opResult = targetEnvRec.getBindingValue(targetName, true);

      assert(opResult instanceof CompletionRecord);
      assert(opResult.type == CompletionRecordType.NORMAL);
      assert(opResult.value == sourceValue);
    });

    it("should throw an error if value is not initialized", () => {
      const envRec = new ModuleEnvironmentRecord(null);
      const name = "name";

      envRec.createImmutableBinding(name, true);

      const opResult = envRec.getBindingValue(name, true);

      assert(opResult instanceof CompletionRecord);
      assert(opResult.type == CompletionRecordType.THROW);
      assert(opResult.value instanceof ReferenceError);
    });
  });
});
