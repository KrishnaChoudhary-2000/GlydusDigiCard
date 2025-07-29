
export interface ExecutiveData {
    id: string;
    _id?: string; // MongoDB _id field
    cardName: string;
    name: string;
    title: string;
    email: string;
    phone: string;
    address: string;
    profilePicture: string;
    companyLogo: string;
    cardBackLogoUrl: string;
    socials: {
        linkedin: { url: string; enabled: boolean };
        instagram: { url: string; enabled: boolean };
        whatsapp: { url: string; enabled: boolean };
        facebook: { url: string; enabled: boolean };
        twitter: { url: string; enabled: boolean };
        youtube: { url: string; enabled: boolean };
    };
    accentColor: string;
}

export interface SocialLink {
    url: string;
    enabled: boolean;
}

export const DEFAULT_CARD_DATA: ExecutiveData = {
    id: "default-card",
    cardName: "My Business Card",
    name: "Test Name",
    title: "Professional Title",
    email: "your.email@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Business St, City, State 12345",
    profilePicture: "",
    companyLogo: "",
    cardBackLogoUrl: "",
    socials: {
        linkedin: { url: "", enabled: false },
        instagram: { url: "", enabled: false },
        whatsapp: { url: "", enabled: false },
        facebook: { url: "", enabled: false },
        twitter: { url: "", enabled: false },
        youtube: { url: "", enabled: false }
    },
    accentColor: "#00D1A6"
};
