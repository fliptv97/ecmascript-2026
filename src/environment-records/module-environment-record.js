import { DeclarativeEnvironmentRecord } from "./declarative-environment-record";

/* A Module Environment Record contains the bindings for the top-level
declarations of a Module. It also contains the bindings that are explicitly
imported by the Module. Its [[OuterEnv]] is a Global Environment Record. */
class ModuleEnvironmentRecord extends DeclarativeEnvironmentRecord {}
