import { fetchUrlMetadata } from "@/lib/fetchUrlMetadata";
import { ICreateLinkPayload } from "@/types/link";

interface CreateLinkOptions {
  customSlug?: string;
  isPasswordProtected?: boolean;
  password?: string;
  title?: string;
  description?: string;
  tags?: string[];
}



export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

// Ensure URL has proper protocol
export const normalizeUrl = (url: string): string => {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`;
  }
  return url;
};

export const generateCreateLinkPayload = async (
  originalUrl: string,
  options: CreateLinkOptions = {}
): Promise<ICreateLinkPayload> => {
  const {
    customSlug,
    isPasswordProtected,
    password,
    title: customTitle,
    description: customDescription,
    tags = [],
  } = options;

  const baseUrl = "xpro.li";

  const urlMetadata = await fetchUrlMetadata(originalUrl)
    .then((metadata) => ({
      title: metadata.title || "Link",
      description: metadata.description || "Shortened link",
      favicon: metadata.favicon || "/favicon.ico",
    }))
    .catch(() => ({
      title: "Link",
      description: "Shortened link",
      favicon: "/favicon.ico",
    }));

  return {
    destinationUrl: originalUrl,
    domain: baseUrl,
    slug: customSlug || undefined,
    title: customTitle || urlMetadata.title,
    description: customDescription || urlMetadata.description,
    favicon: urlMetadata.favicon,
    tags,
    expiresAt: undefined,
    passwordProtected: isPasswordProtected || false,
    password: isPasswordProtected ? password : undefined,
  } as ICreateLinkPayload;
};
