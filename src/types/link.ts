export interface ICreateLinkPayload {
  destinationUrl: string;
  domain: string;
  slug: string;
  title?: string;
  description?: string;
  tags?: string[];
  expiresAt?: Date;
  passwordProtected?: boolean;
  password?: string;
}

export interface CreateLinkResponse {
  ownerId: string;
  domain?: string;
  slug: string;
  shortUrl: string;
  destinationUrl: string;
  title?: string;
  description?: string;
  tags?: string[];
  passwordProtected?: boolean;
  analyticsEnabled?: boolean;
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILink{
  id: string;
  slug: string;
  destinationUrl: string;
  title?: string;
  shortUrl: string;
  description?: string;
  tags?: string[];
  expiresAt?: Date;
  passwordProtected?: boolean;
  password?: string;
  stats: {
    totalClicks: number;
    uniqueCountries: number;
    uniqueDevices: number;
    uniqueBrowsers: number;
    referrerBreakdown: Record<string, number>;
    countryBreakdown: Record<string, number>;
    deviceBreakdown: Record<string, number>;
    browserBreakdown: Record<string, number>;
  };
  createdAt: Date;
}


export interface UpdateLinkResponse {
  link: {
    id: string;
    slug: string;
    destinationUrl: string;
    title?: string;
    description?: string;
    tags?: string[];
    expiresAt?: Date;
    passwordProtected?: boolean;
  };
}

export interface ClickEvent {
  timestamp: Date;
  ip: string;
  country: string;
  city: string;
  device: string;
  browser: string;
  os: string;
  referrer: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export interface AnalyticsResponse {
  totalClicks: number;
  uniqueCountries: number;
  uniqueDevices: number;
  uniqueBrowsers: number;
  referrerBreakdown: Record<string, number>;
  countryBreakdown: Record<string, number>;
  deviceBreakdown: Record<string, number>;
  browserBreakdown: Record<string, number>;
  utmBreakdown: {
    source: Record<string, number>;
    medium: Record<string, number>;
    campaign: Record<string, number>;
  };
  clicks: ClickEvent[];
}
