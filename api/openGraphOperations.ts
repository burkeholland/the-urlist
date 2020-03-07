import {
  IOpenGraphScraperResponse,
  OpenGraphResponse
} from "./Model/OpenGraphResponse";
import * as ogs from "open-graph-scraper";

export default {
  async getOGResponse(url: string): Promise<OpenGraphResponse> {
    const options = { url: url };

    const response = await ogs(options);
    const scraperResponse = <IOpenGraphScraperResponse>response.data;

    return new OpenGraphResponse(scraperResponse);
  }
};
