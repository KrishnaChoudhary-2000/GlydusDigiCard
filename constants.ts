
import type { ExecutiveData } from './types';
import { DEFAULT_CARD_DATA as defaultCard } from './types';

export const executiveData: ExecutiveData = {
    id: "default-card",
    cardName: "My Business Card",
    name: "Test User",
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

export const DEFAULT_CARD_DATA = defaultCard;