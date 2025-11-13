import assert from "node:assert";
import { describe, it } from "node:test";
import { Completion, Type as CompletionType } from "../completion.js";
import { Module } from "../module.js";
import { ModuleEnvironment } from "./module-environment.js";

describe("ModuleEnvironment", () => {
  describe("getBindingValue", () => {
    it("should return bound value", () => {
      const envRec = new ModuleEnvironment(null);
      const name = "name";
      const value = "Philip";

      envRec.createImmutableBinding(name, true);
      envRec.initializeBinding(name, value);

      const opResult = envRec.getBindingValue(name, true);

      assert(opResult instanceof Completion);
      assert(opResult.type == CompletionType.NORMAL);
      assert(opResult.value == value);
    });

    it("should return indirectly bound value", () => {
      const sourceEnvRec = new ModuleEnvironment(null);
      const sourceName = "name";
      const sourceValue = "Philip";

      sourceEnvRec.createImmutableBinding(sourceName, true);
      sourceEnvRec.initializeBinding(sourceName, sourceValue);

      const targetEnvRec = new ModuleEnvironment(null);
      const targetName = "targetName";
      const moduleRec = new Module(sourceEnvRec);

      targetEnvRec.createImportBinding(targetName, moduleRec, sourceName);

      const opResult = targetEnvRec.getBindingValue(targetName, true);

      assert(opResult instanceof Completion);
      assert(opResult.type == CompletionType.NORMAL);
      assert(opResult.value == sourceValue);
    });

    it("should throw an error if value is not initialized", () => {
      const envRec = new ModuleEnvironment(null);
      const name = "name";

      envRec.createImmutableBinding(name, true);

      const opResult = envRec.getBindingValue(name, true);

      assert(opResult instanceof Completion);
      assert(opResult.type == CompletionType.THROW);
      assert(opResult.value instanceof ReferenceError);
    });
  });
});
