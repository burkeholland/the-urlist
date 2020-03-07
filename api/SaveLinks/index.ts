import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import CosmosDBClient from "../CosmosDBClient";
import linkOperations from "../linkOperations";
import { ILinkBundle } from "../Model/ILinkBundle";
import { ValidationResult } from "../Model/ValidationResult";
import { IProblemDetail } from "../Model/ProblemDetails";

const httpTrigger: AzureFunction = async function(
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const linkDocument = <ILinkBundle>req.body;

    // Check to make sure there are actually links in the request
    let validationResult = linkOperations.validateLinks(linkDocument, req);

    if (validationResult.error) {
      return handleError(validationResult.error, context);
    }

    // Ensure that the user passed a vanity. If not, auto-generate one
    linkDocument.vanityUrl = await linkOperations.ensureVanity(
      linkDocument,
      req
    );

    // Check to make sure the vanity passes validation checks
    validationResult = linkOperations.validateVanity(linkDocument, req);

    if (validationResult.error) {
      return handleError(validationResult.error, context);
    }

    // Create the link document if it doesn't already exist
    validationResult = await createLinkBundle(linkDocument, req);

    if (validationResult.error) {
      return handleError(validationResult.error, context);
    }

    context.res = {
      body: linkDocument
    };
  } catch (err) {
    handleError(err, context);
  }
};

async function createLinkBundle(
  linkDocument: ILinkBundle,
  req: HttpRequest
): Promise<ValidationResult> {
  const client = new CosmosDBClient();
  let isValid = true;
  let problemDetails: IProblemDetail;

  try {
    await client.container.items.create(linkDocument);
  } catch (err) {
    isValid = false;
    problemDetails = {
      title: "Could not create link bundle",
      detail: "Vanity link already in use",
      status: 400,
      type: "/theurlist/clientissue",
      instance: req.url
    };
  } finally {
    return new ValidationResult(isValid, problemDetails);
  }
}

function handleError(error: IProblemDetail, context: Context) {
  // TODO: Log ERROR with AppInsights

  context.res = {
    body: error.detail,
    status: error.status
  };
}

export default httpTrigger;
