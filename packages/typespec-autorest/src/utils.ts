import {
  getClientNameOverride,
  type TCGCContext,
} from "@azure-tools/typespec-client-generator-core";
import {
  getFriendlyName,
  getProjectedName,
  getVisibility,
  isGlobalNamespace,
  isService,
  isTemplateInstance,
  ModelProperty,
  Operation,
  Program,
  Service,
  Type,
} from "@typespec/compiler";
import { getOperationId } from "@typespec/openapi";
import { pascalCase } from "change-case";

export interface AutorestEmitterContext {
  readonly program: Program;
  readonly service: Service;
  readonly outputFile: string;
  readonly tcgcSdkContext: TCGCContext;
  readonly version?: string;
}

export function getClientName(context: AutorestEmitterContext, type: Type & { name: string }) {
  const viaProjection = getProjectedName(context.program, type, "client");
  const clientName = getClientNameOverride(context.tcgcSdkContext, type);
  return clientName ?? viaProjection ?? type.name;
}
/**
 * Determines whether a type will be inlined in OpenAPI rather than defined
 * as a schema and referenced.
 *
 * All anonymous types (anonymous models, arrays, tuples, etc.) are inlined.
 *
 * Template instantiations are inlined unless they have a friendly name.
 *
 * A friendly name can be provided by the user using `@friendlyName`
 * decorator, or chosen by default in simple cases.
 */
export function shouldInline(program: Program, type: Type): boolean {
  if (getFriendlyName(program, type)) {
    return false;
  }
  switch (type.kind) {
    case "Model":
      return !type.name || isTemplateInstance(type);
    case "Scalar":
      return program.checker.isStdType(type) || isTemplateInstance(type);
    case "Enum":
    case "Union":
      return !type.name;
    default:
      return true;
  }
}

/**
 * Resolve the OpenAPI operation ID for the given operation using the following logic:
 * - If @operationId was specified use that value
 * - If operation is defined at the root or under the service namespace return `<operation.name>`
 * - Otherwise(operation is under another namespace or interface) return `<namespace/interface.name>_<operation.name>`
 *
 * @param program TypeSpec Program
 * @param operation Operation
 * @returns Operation ID in this format `<name>` or `<group>_<name>`
 */
export function resolveOperationId(context: AutorestEmitterContext, operation: Operation) {
  const { program } = context;
  const explicitOperationId = getOperationId(program, operation);
  if (explicitOperationId) {
    return explicitOperationId;
  }

  const operationName = getClientName(context, operation);
  if (operation.interface) {
    return pascalCaseForOperationId(
      `${getClientName(context, operation.interface)}_${operationName}`,
    );
  }
  const namespace = operation.namespace;
  if (
    namespace === undefined ||
    isGlobalNamespace(program, namespace) ||
    isService(program, namespace)
  ) {
    return pascalCase(operationName);
  }

  return pascalCaseForOperationId(`${namespace.name}_${operationName}`);
}

/**
 * Determines if a property is read-only, which is defined as being
 * decorated `@visibility("read")`.
 *
 * If there is more than 1 `@visibility` argument, then the property is not
 * read-only. For example, `@visibility("read", "update")` does not
 * designate a read-only property.
 */
export function isReadonlyProperty(program: Program, property: ModelProperty) {
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  const visibility = getVisibility(program, property);
  // note: multiple visibilities that include read are not handled using
  // readonly: true, but using separate schemas.
  return visibility?.length === 1 && visibility[0] === "read";
}

function pascalCaseForOperationId(name: string) {
  return name
    .split("_")
    .map((s) => pascalCase(s))
    .join("_");
}
