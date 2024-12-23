import { Operation, createRule } from "@typespec/compiler";
import { getOperationVerb } from "@typespec/http";

import { getActionDetails } from "@typespec/rest";
import { isSourceOperationResourceManagerInternal } from "./utils.js";

export const armResourceInvalidActionVerbRule = createRule({
  name: "arm-resource-invalid-action-verb",
  severity: "warning",
  description: "Actions must be HTTP Post or Get operations.",
  url: "https://azure.github.io/typespec-azure/docs/libraries/azure-resource-manager/rules/arm-resource-invalid-action-verb",
  messages: {
    default: "Actions must be HTTP Post or Get operations.",
  },
  create(context) {
    return {
      operation: (operation: Operation) => {
        if (!isSourceOperationResourceManagerInternal(operation)) {
          const actionType = getActionDetails(context.program, operation);
          const verb = getOperationVerb(context.program, operation);
          if (actionType !== undefined && verb !== "post" && verb !== "get") {
            context.reportDiagnostic({
              target: operation,
            });
          }
        }
      },
    };
  },
});
