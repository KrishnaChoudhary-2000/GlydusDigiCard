import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
    cardName: {
        type: String,
        required: true,
        default: 'My Business Card'
    },
    name: {
        type: String,
        required: true,
        default: 'Your Name'
    },
    title: {
        type: String,
        default: 'Professional Title'
    },
    companyName: {
        type: String,
        default: 'Your Company'
    },
    companyWebsite: {
        type: String,
        default: 'https://example.com'
    },
    email: {
        type: String,
        default: 'your.email@example.com'
    },
    phone: {
        type: String,
        default: '+1 (555) 123-4567'
    },
    address: {
        type: String,
        default: '123 Business St, City, State 12345'
    },
    addressLink: {
        type: String,
        default: 'https://maps.google.com/?q=123+Business+St,+City,+State+12345'
    },
    calendlyLink: {
        type: String,
        default: 'https://calendly.com/your-username'
    },
    profilePictureUrl: {
        type: String,
        default: ''
    },
    companyLogoUrl: {
        type: String,
        default: ''
    },
    companyLogoPosition: {
        x: { type: Number, default: 50 },
        y: { type: Number, default: 50 }
    },
    companyLogoSize: {
        type: Number,
        default: 140
    },
    cardBackLogoUrl: {
        type: String,
        default: ''
    },
    cardBackLogoSize: {
        type: Number,
        default: 160
    },
    socials: {
        linkedin: {
            url: { type: String, default: '' },
            enabled: { type: Boolean, default: false }
        },
        instagram: {
            url: { type: String, default: '' },
            enabled: { type: Boolean, default: false }
        },
        whatsapp: {
            url: { type: String, default: '' },
            enabled: { type: Boolean, default: false }
        },
        facebook: {
            url: { type: String, default: '' },
            enabled: { type: Boolean, default: false }
        },
        twitter: {
            url: { type: String, default: '' },
            enabled: { type: Boolean, default: false }
        },
        youtube: {
            url: { type: String, default: '' },
            enabled: { type: Boolean, default: false }
        }
    },
    styleOptions: {
        accentColor: {
            type: String,
            default: '#00D1A6'
        }
    },
    meetingButtonText: {
        type: String,
        default: 'Book a Meeting'
    },
    saveContactButtonText: {
        type: String,
        default: 'Save Contact'
    }
}, {
    timestamps: true
});

export default mongoose.model('Card', cardSchema); 