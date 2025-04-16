import axios from "axios";
import * as cheerio from "cheerio";

export interface UrlMetadata {
  title: string;
  description: string;
  favicon: string;
}

export async function fetchUrlMetadata(
  destinationUrl: string
): Promise<UrlMetadata> {
  try {
    const response = await axios.get(destinationUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; LinkFluxBot/1.0)",
      },
      timeout: 5000,
    });

    if (typeof response.data !== "string") {
      throw new Error("Response data is not a string");
    }
    const $ = cheerio.load(response.data);

    const title = $("title").text() || "";

    const description =
      $('meta[name="description"]').attr("content") ||
      $('meta[property="og:description"]').attr("content") ||
      "";

    let favicon =
      $('link[rel="icon"]').attr("href") ||
      $('link[rel="shortcut icon"]').attr("href") ||
      "/favicon.ico";

    // Make favicon absolute if it's relative
    if (favicon && !favicon.startsWith("http")) {
      const base = new URL(destinationUrl);
      favicon = new URL(favicon, base.origin).href;
    }

    return {
      title,
      description,
      favicon,
    };
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return {
      title: "",
      description: "",
      favicon: "",
    };
  }
}
