import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import CosmosDBClient from "../CosmosDBClient";

const httpTrigger: AzureFunction = async function(
  context: Context,
  req: HttpRequest
): Promise<void> {
  const cosmosClient = new CosmosDBClient();
  const vanityUrl = req.params.vanityUrl || "";

  const query = await cosmosClient.container.items.query(`
        SELECT TOP 1 * FROM linkbundles lb 
        WHERE LOWER(lb.vanityUrl) = LOWER('${vanityUrl}')`);

  const links = await query.fetchAll();

  context.res = {
    body: links.resources[0]
  };
};

export default httpTrigger;
