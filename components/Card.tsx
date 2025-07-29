
import React from 'react';
import type { ExecutiveData } from '../types';
import { GlydusLogo } from '../assets/icons';

// Generate VCF content for contact saving
const generateVCF = (vcfData: ExecutiveData): string => {
    let vCard = 'BEGIN:VCARD\n';
    vCard += 'VERSION:3.0\n';
    vCard += `FN:${vcfData.name}\n`;
    vCard += `TEL:${vcfData.phone}\n`;
    vCard += `EMAIL:${vcfData.email}\n`;
    vCard += `TITLE:${vcfData.title}\n`;
    vCard += `ADR:;;${vcfData.address}\n`;
    
    // Add profile picture if available
    if (vcfData.profilePicture && vcfData.profilePicture.startsWith('data:image/')) {
        const mimeMatch = vcfData.profilePicture.match(/:(.*?);/);
        if (mimeMatch) {
            const mimeType = mimeMatch[1];
            const base64Data = vcfData.profilePicture.split(',')[1];
            vCard += `PHOTO;ENCODING=BASE64;TYPE=${mimeType}:${base64Data}\n`;
        }
    } else if (vcfData.profilePicture) {
        vCard += `PHOTO;VALUE=URL:${vcfData.profilePicture}\n`;
    }
    
    vCard += 'END:VCARD';
    return vCard;
};

// Download VCF file
const downloadVCF = (vcfData: ExecutiveData) => {
    const vcfContent = generateVCF(vcfData);
    const blob = new Blob([vcfContent], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${vcfData.name.replace(/\s+/g, '_')}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export const CardPreview: React.FC<{ data: ExecutiveData | null; onUpdate: (updates: Partial<ExecutiveData>) => void; }> = ({ data }) => {
    if (!data) return null;

    const { name, title, profilePicture, companyLogo, socials } = data;

    return (
        <div className="flex-1 flex items-center justify-center p-6 bg-dark-bg">
            <div className="w-full max-w-sm">
                {/* Card Front */}
                <div className="premium-card-base premium-card-bg relative overflow-hidden rounded-2xl p-6 mb-6">
                    {/* Profile Picture */}
                    {profilePicture && (
                        <div className="absolute top-4 right-4 w-16 h-16 rounded-full overflow-hidden border-2 border-white/20">
                            <img 
                                src={profilePicture} 
                                alt={name} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Company Logo */}
                    {companyLogo && (
                        <div 
                            className="absolute"
                            style={{
                                left: '50%',
                                top: '20%',
                                transform: 'translate(-50%, -50%)',
                                width: '120px',
                                height: '60px'
                            }}
                        >
                            <img 
                                src={companyLogo} 
                                alt="Company logo" 
                                className="max-h-[60px] w-full object-contain pointer-events-none" 
                            />
                        </div>
                    )}

                    {/* Name */}
                    <div className="text-center mb-4">
                        <h1 className="premium-h1-shadow name-display text-3xl font-bold text-white leading-tight">
                            {name}
                        </h1>
                    </div>

                    {/* Title */}
                    <div className="text-center mb-6">
                        <p className="text-lg text-gray-300">{title}</p>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-3 mb-6">
                        <div className="contact-row-link p-3 rounded-lg">
                            <a href={`tel:${data.phone}`} className="flex items-center text-white">
                                <span className="text-brand-accent mr-2">📞</span>
                                {data.phone}
                            </a>
                        </div>
                        <div className="contact-row-link p-3 rounded-lg">
                            <a href={`mailto:${data.email}`} className="flex items-center text-white">
                                <span className="text-brand-accent mr-2">✉️</span>
                                {data.email}
                            </a>
                        </div>
                        <div className="contact-row-link p-3 rounded-lg">
                            <a 
                                href={`https://maps.google.com/?q=${encodeURIComponent(data.address)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-white"
                            >
                                <span className="text-brand-accent mr-2">📍</span>
                                {data.address}
                            </a>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button 
                            onClick={() => downloadVCF(data)}
                            className="premium-action-button w-full p-3 rounded-lg flex items-center justify-center"
                        >
                            <span className="text-brand-accent mr-2">💾</span>
                            <span className="font-semibold text-white">Save Contact</span>
                        </button>
                    </div>

                    {/* Social Links */}
                    <div className="flex justify-center space-x-3 mt-6">
                        {Object.entries(socials).map(([platform, social]) => {
                            if (!social.enabled || !social.url) return null;
                            
                            const iconMap: Record<string, string> = {
                                linkedin: '💼',
                                instagram: '📷',
                                twitter: '🐦',
                                facebook: '📘',
                                whatsapp: '💬',
                                youtube: '📺'
                            };
                            
                            return (
                                <a
                                    key={platform}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-icon-link"
                                >
                                    {iconMap[platform] || '🔗'}
                                </a>
                            );
                        })}
                    </div>

                    {/* Glydus Logo */}
                    <div className="absolute bottom-2 right-2">
                        <GlydusLogo className="text-brand-accent text-xs" />
                    </div>
                </div>

                {/* Card Back */}
                <div className="premium-card-base premium-card-bg relative overflow-hidden rounded-2xl p-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white mb-4">Digital Business Card</h2>
                        <p className="text-gray-300 mb-6">Scan or tap to connect</p>
                        
                        {/* Card Back Logo */}
                        {data.cardBackLogoUrl && (
                            <div className="flex justify-center mb-6">
                                <img 
                                    src={data.cardBackLogoUrl} 
                                    alt="Card back logo"
                                    className="max-w-[120px] max-h-[120px] object-contain"
                                />
                            </div>
                        )}
                        
                        <div className="text-center">
                            <p className="text-[#00D1A6] font-semibold">MAKE WAVES</p>
                            <p className="text-gray-400 text-sm mt-2">Powered by Glydus</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};