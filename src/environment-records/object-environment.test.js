import assert from "node:assert";
import { describe, it } from "node:test";
import { Completion, Type as CompletionType } from "../completion.js";
import { UNUSED } from "../constants.js";
import { ObjectEnvironment } from "./object-environment.js";

describe("ObjectEnvironment", () => {
  const name = "name";
  const value = "value";

  describe("hasBinding", () => {
    it("should return false, if name isn't bound", () => {
      const envRec = new ObjectEnvironment({}, false, null);
      const opResult = envRec.hasBinding(name);

      assert(opResult instanceof Completion);
      assert(opResult.type == CompletionType.NORMAL);
      assert(opResult.value === false);
    });

    it("should return true, if name is bound", () => {
      const envRec = new ObjectEnvironment({}, false, null);

      envRec.createMutableBinding(name, false);
      envRec.setMutableBinding(name, value, true);

      const opResult = envRec.hasBinding(name);

      assert(opResult instanceof Completion);
      assert(opResult.type == CompletionType.NORMAL);
      assert(opResult.value === true);
    });

    describe("with environment", () => {
      it("should return true, if name is bound and isn't marked as unscopable", () => {
        const envRec = new ObjectEnvironment({}, true, null);

        envRec.createMutableBinding(name, false);
        envRec.setMutableBinding(name, value, true);

        const opResult = envRec.hasBinding(name);

        assert(opResult instanceof Completion);
        assert(opResult.type == CompletionType.NORMAL);
        assert(opResult.value === true);
      });

      it("should return false, if name is bound and marked as unscopable", () => {
        const bindingObject = {
          [Symbol.unscopables]: {
            [name]: true,
          },
        };
        const envRec = new ObjectEnvironment(bindingObject, true, null);

        envRec.createMutableBinding(name, false);
        envRec.setMutableBinding(name, value, true);

        const opResult = envRec.hasBinding(name);

        assert(opResult instanceof Completion);
        assert(opResult.type == CompletionType.NORMAL);
        assert(opResult.value === false);
      });
    });
  });

  it('should properly implement "createMutableBinding"', () => {
    const envRec = new ObjectEnvironment({}, false, null);
    const opResult = envRec.createMutableBinding(name, false);

    assert(opResult instanceof Completion);
    assert(opResult.type == CompletionType.NORMAL);
    assert(opResult.value === UNUSED);
    assert(envRec.hasBinding(name).value);
  });

  it('should properly implement "initializeBinding"', () => {
    const envRec = new ObjectEnvironment({}, false, null);

    envRec.createMutableBinding(name, false);

    const opResult = envRec.initializeBinding(name, value);

    assert(opResult instanceof Completion);
    assert(opResult.type == CompletionType.NORMAL);
    assert(opResult.value === UNUSED);
    assert(envRec.getBindingValue(name, true).value === value);
  });

  describe("setMutableBinding", () => {
    it("[STRICT MODE] should update value of existing property", () => {
      const envRec = new ObjectEnvironment({}, false, null);

      envRec.createMutableBinding(name, false);

      assert(envRec.getBindingValue(name, true).value === undefined);

      const opResult = envRec.setMutableBinding(name, value, true);

      assert(opResult instanceof Completion);
      assert(opResult.type == CompletionType.NORMAL);
      assert(opResult.value === UNUSED);
      assert(envRec.getBindingValue(name, true).value === value);
    });

    it("[STRICT MODE] should throw an error if property doesn't exist", () => {
      const envRec = new ObjectEnvironment({}, false, null);
      const opResult = envRec.setMutableBinding(name, value, true);

      assert(opResult instanceof Completion);
      assert(opResult.type == CompletionType.THROW);
      assert(
        envRec.getBindingValue(name, true).value instanceof ReferenceError
      );
    });

    it("should create property if it doesn't exists and set it's value", () => {
      const envRec = new ObjectEnvironment({}, false, null);
      const opResult = envRec.setMutableBinding(name, value, false);

      assert(opResult instanceof Completion);
      assert(opResult.type == CompletionType.NORMAL);
      assert(opResult.value === UNUSED);
      assert(envRec.getBindingValue(name, true).value === value);
    });
  });

  describe("getBindingValue", () => {
    it("should return undefined, if name isn't bound", () => {
      const envRec = new ObjectEnvironment({}, true, null);
      const opResult = envRec.getBindingValue(name, false);

      assert(opResult instanceof Completion);
      assert(opResult.type == CompletionType.NORMAL);
      assert(opResult.value === undefined);
    });

    it("[Strict Mode] should throw an error, if name isn't bound", () => {
      const envRec = new ObjectEnvironment({}, true, null);
      const opResult = envRec.getBindingValue(name, true);

      assert(opResult instanceof Completion);
      assert(opResult.type == CompletionType.THROW);
      assert(opResult.value instanceof ReferenceError);
    });

    it("should return value, if name is bound", () => {
      const envRec = new ObjectEnvironment({}, true, null);

      envRec.createMutableBinding(name, false);
      envRec.setMutableBinding(name, value, true);

      const opResult = envRec.getBindingValue(name, true);

      assert(opResult instanceof Completion);
      assert(opResult.type == CompletionType.NORMAL);
      assert(opResult.value === value);
    });
  });

  it('should properly implement "deleteBinding"', () => {
    const envRec = new ObjectEnvironment({}, true, null);

    envRec.createMutableBinding(name, true);

    assert(envRec.hasBinding(name).value);

    const opResult = envRec.deleteBinding(name);

    assert(opResult instanceof Completion);
    assert(opResult.type == CompletionType.NORMAL);
    assert(opResult.value === true);
    assert(!envRec.hasBinding(name).value);
  });
});
