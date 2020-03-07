import { CosmosClient, Database, Container } from "@azure/cosmos";

const endpoint: string = process.env.COSMOS_ENDPOINT;
const key: string = process.env.COSMOS_KEY;

export default class CosmosDBClient {
  client: CosmosClient;
  database: Database;
  container: Container;

  constructor(
    database: string = "theurlist",
    collection: string = "linkbundles"
  ) {
    this.client = new CosmosClient({ endpoint, key });

    this.database = this.client.database(database);
    this.container = this.database.container(collection);
  }
}
