import { createRule, Model } from "@typespec/compiler";
import { isCustomAzureResource } from "../resource.js";

export const armCustomResourceUsageDiscourage = createRule({
  name: "arm-custom-resource-usage-discourage",
  severity: "warning",
  description: "Verify the usage of @customAzureResource decorator.",
  messages: {
    default: `Avoid using the @customAzureResource decorator. It doesn't provide validation for ARM resources, and its usage should be limited to brownfield services migration.`,
  },
  create(context) {
    return {
      model: (model: Model) => {
        if (isCustomAzureResource(context.program, model)) {
          context.reportDiagnostic({
            code: "arm-custom-resource-usage-discourage",
            target: model,
          });
        }
      },
    };
  },
});
