import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
  cardName: {
    type: String,
    required: true,
    default: 'My Business Card'
  },
  name: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  companyWebsite: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  addressLink: {
    type: String,
    default: ''
  },
  calendlyLink: {
    type: String,
    default: ''
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
    linkedin: { url: String, enabled: Boolean },
    instagram: { url: String, enabled: Boolean },
    whatsapp: { url: String, enabled: Boolean },
    facebook: { url: String, enabled: Boolean },
    twitter: { url: String, enabled: Boolean },
    youtube: { url: String, enabled: Boolean }
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