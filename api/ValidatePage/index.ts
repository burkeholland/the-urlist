import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import openGraphOperations from "../openGraphOperations";
import { IProblemDetail } from "../Model/ProblemDetails";

const httpTrigger: AzureFunction = async function(
  context: Context,
  req: HttpRequest
): Promise<void> {
  const data = req.body;

  try {
    const ogResponse = await openGraphOperations.getOGResponse(data.url);

    context.res = {
      body: ogResponse
    };
  } catch (err) {
    const problemDetail: IProblemDetail = {
      title: "Could not validate links",
      detail: err.message,
      status: 400,
      type: "/theurlist/clientissue",
      instance: req.url
    };

    handleError(problemDetail, context);
  }
};

function handleError(error: IProblemDetail, context: Context) {
  // TODO: Log ERROR with AppInsights

  context.res = {
    body: error.detail,
    status: error.status
  };
}

export default httpTrigger;
