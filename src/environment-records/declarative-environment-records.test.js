import { describe, it } from "node:test";
import assert from "node:assert";

import { Flags as BindingFlags } from "../binding.js";
import { CompletionRecord, Type } from "../completion-record.js";
import { UNUSED } from "../constants.js";
import { hasFlag } from "../utils.js";
import { DeclarativeEnvironmentRecord } from "./declarative-environment-record.js";

describe("DeclarativeEnvironmentRecord", () => {
  it("should properly create mutable (non-deletable) binding ", () => {
    const ident = "ident";
    const envRec = new DeclarativeEnvironmentRecord(null);

    const opResult = envRec.createMutableBinding(ident, false);

    assert(opResult instanceof CompletionRecord);
    assert(opResult.type == Type.NORMAL);
    assert(opResult.value === UNUSED);

    assert(envRec._bindings.size === 1);

    const binding = envRec._bindings.get(ident);

    assert(hasFlag(binding.flags, BindingFlags.UNINITIALIZED));
    assert(hasFlag(binding.flags, BindingFlags.MUTABLE));
    assert(!hasFlag(binding.flags, BindingFlags.DELETABLE));
  });

  it("should properly create mutable (deletable) binding ", () => {
    const ident = "ident";
    const envRec = new DeclarativeEnvironmentRecord(null);

    envRec.createMutableBinding(ident, true);

    const binding = envRec._bindings.get(ident);

    assert(hasFlag(binding.flags, BindingFlags.UNINITIALIZED));
    assert(hasFlag(binding.flags, BindingFlags.MUTABLE));
    assert(hasFlag(binding.flags, BindingFlags.DELETABLE));
  });
});
