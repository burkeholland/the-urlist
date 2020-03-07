interface IOpenGraphScraperResponse {
  ogUrl: string;
  twitterTitle: string;
  ogTitle: string;
  twitterDescription: string;
  ogDescription: string;
  ogImage: any;
}

class OpenGraphResponse {
  id: string;
  title: string;
  description: string;
  image: string;

  constructor(scraperResponse: IOpenGraphScraperResponse) {
    this.id = scraperResponse.ogUrl;
    this.title = scraperResponse.twitterTitle || scraperResponse.ogTitle;
    this.description =
      scraperResponse.twitterDescription || scraperResponse.ogDescription;

    if (scraperResponse.ogImage && scraperResponse.ogImage.length > 0) {
      this.image =
        scraperResponse.ogImage.url || scraperResponse.ogImage[0].url || "";
    }
  }
}

export { OpenGraphResponse, IOpenGraphScraperResponse };
