# Digital Business Card Creator

A modern, responsive digital business card creator with real-time preview and sharing capabilities.

## Features

- **Real-time Preview**: See changes instantly as you edit
- **Image Upload**: Upload profile pictures and company logos using ImgBB hosting
- **Social Media Integration**: Add links to all major social platforms
- **Contact Information**: Phone, email, and address with click-to-call/email
- **VCF Export**: Save contact information directly to phone contacts
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Theme**: Professional dark grey theme with green accents
- **Manual Save**: Control when to save changes with manual save button
- **NFC Compatible**: Ultra-short URLs perfect for 80-bit NFC cards

## NFC Short URL System

This application includes a special short URL system designed specifically for NFC cards. The system generates extremely short URLs (6 characters) that can fit within the 80-bit storage limit of NFC cards.

### How NFC Short URLs Work:

1. **Generate Short ID**: Creates a 6-character random ID (e.g., `Ab3x9K`)
2. **Store Mapping**: Maps the short ID to the full card ID in the database
3. **Create Short URL**: Generates URLs like `https://yourdomain.com/card/Ab3x9K`
4. **NFC Ready**: The short URL fits perfectly in 80-bit NFC cards

### Benefits for NFC Cards:

- **Ultra-Short**: Only 6 characters for the ID portion
- **NFC Compatible**: Fits within 80-bit storage constraints
- **Professional**: Clean, memorable URLs
- **Reliable**: Server-side redirects ensure links always work
- **Scalable**: Can handle millions of unique short URLs

### Example URLs:

- **Old System**: `https://domain.com/?card=eyJuYW1lIjoiSm9obiBEb2UiLCJ0aXRsZSI6IkNFTyIsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSIsInBob25lIjoiKzEyMzQ1Njc4OTAiLCJhZGRyZXNzIjoiMTIzIE1haW4gU3QsIENpdHksIFN0YXRlIDEyMzQ1Iiwic29jaWFscyI6eyJsaW5rZWRpbiI6eyJ1cmwiOiJodHRwczovL2xpbmtlZGluLmNvbS9pbi9qb2huZG9lIiwidmlzaWJsZSI6dHJ1ZX0sImluc3RhZ3JhbSI6eyJ1cmwiOiJodHRwczovL2luc3RhZ3JhbS5jb20vam9obmRvZSIsInZpc2libGUiOnRydWV9fX0=`
- **New NFC System**: `https://domain.com/card/Ab3x9K`

## Image Hosting with ImgBB

This application uses ImgBB for image hosting to keep share links short and professional. When you upload images (profile pictures, company logos), they are automatically uploaded to ImgBB and the URLs are stored in the card data.

### Benefits:
- **Short URLs**: Images are hosted on ImgBB with short, clean URLs
- **Fast Loading**: Images load quickly from ImgBB's CDN
- **Professional**: No long base64 encoded strings in share links
- **Reliable**: ImgBB provides reliable image hosting

### How it works:
1. Select an image file in the editor
2. Image is automatically uploaded to ImgBB
3. Short ImgBB URL is stored in the card data
4. Image displays immediately in the preview
5. Share links remain short and professional

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Development Server**:
   ```bash
   npm run dev
   ```

3. **Start the Backend Server** (in a separate terminal):
   ```bash
   cd server
   npm install
   npm run dev
   ```

4. **Open the Application**:
   Navigate to `http://localhost:5173` in your browser

## Usage

1. **Edit Card Information**: Fill in your personal and company details
2. **Upload Images**: Add profile pictures and company logos
3. **Add Social Links**: Include your social media profiles
4. **Preview**: See your card in real-time
5. **Save**: Click the save button to persist changes
6. **Share**: Copy the short URL for NFC cards or regular share link

## Keyboard Shortcuts

- **Ctrl+S / Cmd+S**: Save changes (when there are unsaved changes)

## API Endpoints

- `GET /api/cards` - Get all cards
- `GET /api/cards/:id` - Get a specific card
- `POST /api/cards` - Create a new card
- `PUT /api/cards/:id` - Update a card
- `DELETE /api/cards/:id` - Delete a card
- `POST /api/cards/shorten` - Create short URL for NFC cards
- `GET /api/health` - Health check
- `GET /card/:shortId` - Redirect short URL to card

## Technologies Used

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB
- **Image Hosting**: ImgBB API
- **Short URLs**: Custom NFC-compatible short URL system
- **Styling**: Tailwind CSS with custom dark theme

## Configuration

The ImgBB API key is configured in `services/api.ts`. For production, consider moving this to environment variables.

## License

This project is open source and available under the MIT License.
