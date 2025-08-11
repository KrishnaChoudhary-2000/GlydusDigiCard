
export interface SocialLink {
    url: string;
    enabled: boolean;
}

export interface Socials {
  linkedin: SocialLink;
  instagram: SocialLink;
  twitter: SocialLink;
  youtube: SocialLink;
  facebook: SocialLink;
  whatsapp: SocialLink;
}

export interface StyleOptions {
  accentColor: string;
}

export interface ExecutiveData {
    id: string;
    cardName: string;
    name: string;
    title: string;
    companyName: string;
    companyWebsite: string;
    phone: string;
    email: string;
    address: string;
    addressLink: string;
    calendlyLink: string;
    socials: Socials;
    profilePictureUrl?: string | null;
    companyLogoUrl?: string | null;
    companyLogoPosition: { x: number, y: number };
    companyLogoSize: number;
    cardBackLogoUrl?: string | null;
    cardBackLogoSize: number;
    styleOptions: StyleOptions;
    meetingButtonText: string;
    saveContactButtonText: string;
}

export const DEFAULT_CARD_DATA: Omit<ExecutiveData, 'id' | 'cardName'> = {
    name: "Test Name",
    title: "Your Title",
    companyName: "Your Company",
    companyWebsite: "https://example.com",
    phone: "+1234567890",
    email: "email@example.com",
    address: "123 Main St, Anytown, USA",
    addressLink: "https://maps.google.com/?q=123+Main+St,+Anytown,+USA",
    calendlyLink: "https://calendly.com/your-username",
    socials: {
        linkedin: { url: "", enabled: true },
        instagram: { url: "", enabled: false },
        twitter: { url: "", enabled: true },
        youtube: { url: "", enabled: false },
        facebook: { url: "", enabled: false },
        whatsapp: { url: "", enabled: false },
    },
    profilePictureUrl: null,
    companyLogoUrl: null,
    companyLogoPosition: { x: 50, y: 50 },
    companyLogoSize: 140,
    cardBackLogoUrl: null,
    cardBackLogoSize: 150,
    styleOptions: {
        accentColor: "rgba(0,167,128,255)",
    },
    meetingButtonText: "Book a Meeting",
    saveContactButtonText: "Save Contact",
};
