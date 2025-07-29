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
    profilePicture: {
        type: String,
        default: ''
    },
    companyLogo: {
        type: String,
        default: ''
    },
    cardBackLogoUrl: {
        type: String,
        default: ''
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
    accentColor: {
        type: String,
        default: '#00D1A6'
    }
}, {
    timestamps: true
});

// Add a virtual id field that maps to _id
cardSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

// Ensure virtual fields are serialized
cardSchema.set('toJSON', {
    virtuals: true,
    transform: function(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

export default mongoose.model('Card', cardSchema); 