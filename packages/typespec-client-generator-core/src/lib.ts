import { createTypeSpecLibrary, JSONSchemaType, paramMessage } from "@typespec/compiler";
import { SdkEmitterOptions, TCGCEmitterOptions } from "./context.js";

export const SdkEmitterOptionsSchema: JSONSchemaType<SdkEmitterOptions> = {
  type: "object",
  additionalProperties: false,
  properties: {
    "generate-protocol-methods": {
      type: "boolean",
      nullable: true,
      description:
        "When set to `true`, the emitter will generate low-level protocol methods for each service operation if `@protocolAPI` is not set for an operation. Default value is `true`.",
    },
    "generate-convenience-methods": {
      type: "boolean",
      nullable: true,
      description:
        "When set to `true`, the emitter will generate low-level protocol methods for each service operation if `@convenientAPI` is not set for an operation. Default value is `true`.",
    },
    "examples-dir": {
      type: "string",
      nullable: true,
      format: "absolute-path",
      description:
        "Specifies the directory where the emitter will look for example files. If the flag isn’t set, the emitter defaults to using an `examples` directory located at the project root.",
    },
    namespace: {
      type: "string",
      nullable: true,
      description:
        "Specifies the namespace you want to override for namespaces set in the spec. With this config, all namespace for the spec types will default to it.",
    },
    "api-version": {
      type: "string",
      nullable: true,
      description:
        "Use this flag if you would like to generate the sdk only for a specific version. Default value is the latest version. Also accepts values `latest` and `all`.",
    },
    license: {
      type: "object",
      additionalProperties: false,
      nullable: true,
      required: ["name"],
      properties: {
        name: {
          type: "string",
          nullable: false,
          description:
            "License name. The config is required. Predefined license are: MIT License, Apache License 2.0, BSD 3-Clause License, MPL 2.0, GPL-3.0, LGPL-3.0. For other license, you need to configure all the other license config manually.",
        },
        company: {
          type: "string",
          nullable: true,
          description: "License company name. It will be used in copyright sentences.",
        },
        link: {
          type: "string",
          nullable: true,
          description: "License link.",
        },
        header: {
          type: "string",
          nullable: true,
          description:
            "License header. It will be used in the header comment of generated client code.",
        },
        description: {
          type: "string",
          nullable: true,
          description: "License description. The full license text.",
        },
      },
      description: "License information for the generated client code.",
    },
  },
};

const TCGCEmitterOptionsSchema: JSONSchemaType<TCGCEmitterOptions> = {
  type: "object",
  additionalProperties: false,
  properties: {
    "emitter-name": {
      type: "string",
      nullable: true,
      description: "Set `emitter-name` to output TCGC code models for specific language's emitter.",
    },
    ...SdkEmitterOptionsSchema.properties!,
  },
};

export const $lib = createTypeSpecLibrary({
  name: "@azure-tools/typespec-client-generator-core",
  diagnostics: {
    "client-service": {
      severity: "warning",
      messages: {
        default: paramMessage`Client "${"name"}" is not inside a service namespace. Use @client({service: MyServiceNS})`,
      },
    },
    "union-null": {
      severity: "warning",
      messages: {
        default: "Cannot have a union containing only null types.",
      },
    },
    "union-circular": {
      severity: "warning",
      messages: {
        default: "Cannot have a union containing self.",
      },
    },
    "invalid-access": {
      severity: "error",
      messages: {
        default: `Access value must be "public" or "internal".`,
      },
    },
    "invalid-usage": {
      severity: "error",
      messages: {
        default: `Usage value must be 2 ("input") or 4 ("output").`,
      },
    },
    "conflicting-multipart-model-usage": {
      severity: "error",
      messages: {
        default: paramMessage`Model '${"modelName"}' cannot be used as both multipart/form-data input and regular body input. You can create a separate model with name 'model ${"modelName"}FormData' extends ${"modelName"} {}`,
      },
    },
    "discriminator-not-constant": {
      severity: "error",
      messages: {
        default: paramMessage`Discriminator ${"discriminator"} has to be constant`,
      },
    },
    "discriminator-not-string": {
      severity: "warning",
      messages: {
        default: paramMessage`Value of discriminator ${"discriminator"} has to be a string, not ${"discriminatorValue"}`,
      },
    },
    "wrong-client-decorator": {
      severity: "warning",
      messages: {
        default: "@client or @operationGroup should decorate namespace or interface in client.tsp",
      },
    },
    "unsupported-kind": {
      severity: "warning",
      messages: {
        default: paramMessage`Unsupported kind ${"kind"}`,
      },
    },
    "multiple-services": {
      severity: "warning",
      messages: {
        default: paramMessage`Multiple services found in definition. Only one service is supported, so we will choose the first one ${"service"}`,
      },
    },
    "server-param-not-path": {
      severity: "error",
      messages: {
        default: paramMessage`Template argument ${"templateArgumentName"} is not a path parameter, it is a ${"templateArgumentType"}. It has to be a path.`,
      },
    },
    "unexpected-http-param-type": {
      severity: "error",
      messages: {
        default: paramMessage`Expected parameter "${"paramName"}" to be of type "${"expectedType"}", but instead it is of type "${"actualType"}"`,
      },
    },
    "multiple-response-types": {
      severity: "warning",
      messages: {
        default: paramMessage`Multiple response types found in operation ${"operation"}. Only one response type is supported, so we will choose the first one ${"response"}`,
      },
    },
    "no-corresponding-method-param": {
      severity: "error",
      messages: {
        default: paramMessage`Missing "${"paramName"}" method parameter in method "${"methodName"}", when "${"paramName"}" must be sent to the service. Add a parameter named "${"paramName"}" to the method.`,
      },
    },
    "unsupported-protocol": {
      severity: "error",
      messages: {
        default: "Currently we only support HTTP and HTTPS protocols",
      },
    },
    "no-emitter-name": {
      severity: "warning",
      messages: {
        default: "Can not find name for your emitter, please check your emitter name.",
      },
    },
    "unsupported-generic-decorator-arg-type": {
      severity: "warning",
      messages: {
        default: paramMessage`Can not parse the arg type for decorator "${"decoratorName"}".`,
      },
    },
    "empty-client-name": {
      severity: "warning",
      messages: {
        default: `Cannot pass an empty value to the @clientName decorator`,
      },
    },
    "override-parameters-mismatch": {
      severity: "error",
      messages: {
        default: paramMessage`Method "${"methodName"}" is not directly referencing the same parameters as in the original operation. The original method has parameters "${"originalParameters"}", while the override method has parameters "${"overrideParameters"}".`,
      },
    },
    "duplicate-client-name": {
      severity: "error",
      messages: {
        default: paramMessage`Client name: "${"name"}" is duplicated in language scope: "${"scope"}"`,
        nonDecorator: paramMessage`Client name: "${"name"}" is defined somewhere causing nameing conflicts in language scope: "${"scope"}"`,
      },
    },
    "example-loading": {
      severity: "warning",
      messages: {
        default: paramMessage`Skipped loading invalid example file: ${"filename"}. Error: ${"error"}`,
        noDirectory: paramMessage`Skipping example loading from ${"directory"} because there was an error reading the directory.`,
        noOperationId: paramMessage`Skipping example file ${"filename"} because it does not contain an operationId and/or title.`,
      },
    },
    "duplicate-example-file": {
      severity: "error",
      messages: {
        default: paramMessage`Example file ${"filename"} uses duplicate title '${"title"}' for operationId '${"operationId"}'`,
      },
    },
    "example-value-no-mapping": {
      severity: "warning",
      messages: {
        default: paramMessage`Value in example file '${"relativePath"}' does not follow its definition:\n${"value"}`,
      },
    },
    "flatten-polymorphism": {
      severity: "error",
      messages: {
        default: `Cannot flatten property of polymorphic type.`,
      },
    },
    "conflict-access-override": {
      severity: "warning",
      messages: {
        default: `@access override conflicts with the access calculated from operation or other @access override.`,
      },
    },
    "conflict-usage-override": {
      severity: "warning",
      messages: {
        default: `@usage override conflicts with the usage calculated from operation or other @usage override.`,
      },
    },
    "duplicate-decorator": {
      severity: "warning",
      messages: {
        default: paramMessage`Decorator ${"decoratorName"} cannot be used twice on the same declaration with same scope.`,
      },
    },
    "empty-client-namespace": {
      severity: "warning",
      messages: {
        default: `Cannot pass an empty value to the @clientNamespace decorator`,
      },
    },
    "unexpected-pageable-operation-return-type": {
      severity: "error",
      messages: {
        default: `Operation is pageable but does not return a correct type.`,
      },
    },
    "invalid-alternate-source-type": {
      severity: "error",
      messages: {
        default: paramMessage`@alternateType only supports scalar types. The source type is '${"typeName"}'.`,
      },
    },
    "invalid-initialized-by": {
      severity: "error",
      messages: {
        default: paramMessage`Invalid 'initializedBy' value. ${"message"}`,
      },
    },
    "api-version-not-string": {
      severity: "warning",
      messages: {
        default: `Api version must be a string or a string enum`,
      },
    },
    "invalid-encode-for-collection-format": {
      severity: "warning",
      messages: {
        default:
          "Only encode of `ArrayEncoding.pipeDelimited` and `ArrayEncoding.spaceDelimited` is supported for collection format.",
      },
    },
    "no-discriminated-unions": {
      severity: "error",
      messages: {
        default:
          "Discriminated unions are not supported. Please redefine the type using model with hierarchy and `@discriminator` decorator.",
      },
    },
  },
  emitter: {
    options: TCGCEmitterOptionsSchema,
  },
});

const { reportDiagnostic, createDiagnostic, createStateSymbol } = $lib;

export { createDiagnostic, createStateSymbol, reportDiagnostic };
