
import React from 'react';
import type { ExecutiveData } from '../types';
import {
    GlydusLogo,
    SaveContactIcon,
    PhoneIcon,
    EmailIcon,
    LocationIcon,
    FacebookIcon,
    LinkedInIcon,
    InstagramIcon,
    WhatsAppIcon,
    XIcon,
    YouTubeIcon,
    CalendarIcon,
    ChevronRightIcon
} from '../assets/icons';

const generateVCardString = (vcfData: ExecutiveData): string => {
    let vCard = `BEGIN:VCARD\nVERSION:3.0\n`;
    const nameParts = vcfData.name.split(' ');
    const lastName = nameParts.pop() || '';
    const firstName = nameParts.join(' ');
    
    vCard += `N:${lastName};${firstName};;;\n`;
    vCard += `FN:${vcfData.name}\n`;
    vCard += `ORG:${vcfData.companyName}\n`;
    vCard += `TITLE:${vcfData.title}\n`;
    vCard += `TEL;TYPE=WORK,VOICE:${vcfData.phone}\n`;
    vCard += `EMAIL:${vcfData.email}\n`;
    vCard += `ADR;TYPE=WORK:;;${vcfData.address}\n`;
    if (vcfData.companyWebsite) vCard += `URL:${vcfData.companyWebsite}\n`;
    
    if (vcfData.profilePictureUrl && vcfData.profilePictureUrl.startsWith('data:image/')) {
        const mimeMatch = vcfData.profilePictureUrl.match(/:(.*?);/);
        const mimeType = mimeMatch ? mimeMatch[1].toUpperCase().replace('JPEG', 'JPG') : 'JPEG';
        const base64Data = vcfData.profilePictureUrl.split(',')[1];
        vCard += `PHOTO;ENCODING=b;TYPE=${mimeType}:${base64Data}\n`;
    } else if (vcfData.profilePictureUrl) {
        vCard += `PHOTO;VALUE=URL:${vcfData.profilePictureUrl}\n`;
    }
  
    if (vcfData.socials.linkedin.enabled && vcfData.socials.linkedin.url) vCard += `X-SOCIALPROFILE;type=linkedin:${vcfData.socials.linkedin.url}\n`;
    if (vcfData.socials.twitter.enabled && vcfData.socials.twitter.url) vCard += `X-SOCIALPROFILE;type=twitter:${vcfData.socials.twitter.url}\n`;
    if (vcfData.socials.instagram.enabled && vcfData.socials.instagram.url) vCard += `X-SOCIALPROFILE;type=instagram:${vcfData.socials.instagram.url}\n`;
    
    vCard += `END:VCARD`;
    return vCard;
  };

export const CardPreview: React.FC<{ data: ExecutiveData | null; onUpdate: (updates: Partial<ExecutiveData>) => void; }> = ({ data, onUpdate }) => {
    if (!data) {
      return (
        <div className="bg-dark-surface rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-sm mx-auto flex items-center justify-center font-sans text-dark-text-secondary h-full">
          No card selected. Please select or create a card to see the preview.
        </div>
      );
    }
    
    const { name, title, companyWebsite, profilePictureUrl, companyLogoUrl, socials } = data;
    
    // Safety check for styleOptions
    const styleOptions = data.styleOptions || { accentColor: '#00D1A6' };
  
    const formattedPhone = data.phone.startsWith('+91')
      ? data.phone.replace(/^\+(\d{2})(\d{5})(\d{5})/, '+$1 $2 $3')
      : data.phone;
  
    const buttonStyle = { '--accent-color': styleOptions.accentColor } as React.CSSProperties;
    const actionButtonClasses = "flex items-center justify-between w-full p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card-matte focus:ring-[--accent-color] premium-action-button";
  
  
    const showSocialsSection = Object.values(socials).some(link => link.enabled && link.url);
    
    const handleSaveContact = () => {
      if (!data) return;
      const vCardString = generateVCardString(data);
      const blob = new Blob([vCardString], { type: "text/vcard;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${data.name.replace(/ /g, '_')}.vcf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };
  
    const ContactRow = ({ href, icon, text, ariaLabel }: { href?: string; icon: React.ReactNode; text: string; ariaLabel: string }) => {
      const content = (
          <div className="flex items-center space-x-4 group p-3">
              <div className="flex-shrink-0 w-6 flex items-center justify-center">
                  {icon}
              </div>
              <div className="flex-grow min-w-0 text-gray-200 break-words font-medium">
                  {text}
              </div>
          </div>
      );
      
      if (href) {
          return <a href={href} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel} className="contact-row-link">{content}</a>;
      }
      return <div aria-label={ariaLabel}>{content}</div>;
    };
    
    return (
      <div className="relative premium-card-base rounded-3xl w-full max-w-sm mx-auto font-sans overflow-hidden premium-card-bg" style={buttonStyle}>
        <div className="relative z-10">
            <header 
                className="relative h-24"
            >
              {companyLogoUrl && (
                <a
                  href={companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute transition-transform duration-300 hover:scale-105"
                  style={{
                    left: `${data.companyLogoPosition?.x || 50}%`,
                    top: `${data.companyLogoPosition?.y || 50}%`,
                    transform: 'translate(-50%, -50%)',
                    width: `${data.companyLogoSize || 140}px`,
                  }}
                >
                  <img src={companyLogoUrl} alt={`${data.companyName} logo`} className="max-h-[80px] w-full object-contain pointer-events-none" />
                </a>
              )}
            </header>
            
            <div className="relative p-6 md:p-8 pt-0 -mt-10">
              <div className="relative">
                  {profilePictureUrl && (
                      <div className="flex justify-center mb-6">
                          <img 
                          src={profilePictureUrl} 
                          alt={`Profile of ${name}`} 
                          className="w-36 h-36 rounded-full object-cover shadow-2xl ring-4 ring-white/10"
                          />
                      </div>
                  )}
      
                  <section className={`text-center mb-6 ${!profilePictureUrl ? 'pt-8' : ''}`}>
                      <h1 className="text-4xl font-bold text-white tracking-tight premium-h1-shadow name-display leading-tight">{name}</h1>
                      <p className="text-sm mt-3 font-medium text-gray-300 tracking-widest uppercase">{title}</p>
                  </section>
              </div>
      
      
              <div className="flex flex-col gap-3 mb-8">
                  <a href={data.calendlyLink} target="_blank" rel="noopener noreferrer" className={actionButtonClasses}>
                      <div className="flex items-center gap-4">
                          <CalendarIcon className="w-6 h-6" style={{color: styleOptions.accentColor}} />
                          <span className="font-semibold text-white">{data.meetingButtonText}</span>
                      </div>
                      <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                  </a>
                  <button onClick={handleSaveContact} className={actionButtonClasses}>
                      <div className="flex items-center gap-4">
                          <SaveContactIcon className="w-6 h-6" style={{color: styleOptions.accentColor}} />
                          <span className="font-semibold text-white">{data.saveContactButtonText}</span>
                      </div>
                      <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                  </button>
              </div>
      
              <section className="rounded-xl overflow-hidden">
                  <ContactRow 
                  href={`tel:${data.phone}`}
                  icon={<PhoneIcon className="w-5 h-5" style={{color: styleOptions.accentColor}} />}
                  text={formattedPhone}
                  ariaLabel={`Call ${name}`}
                  />
                  <div className="h-px bg-white/10"></div>
                  <ContactRow 
                  href={`mailto:${data.email}`}
                  icon={<EmailIcon className="w-5 h-5" style={{color: styleOptions.accentColor}} />}
                  text={data.email}
                  ariaLabel={`Email ${name}`}
                  />
                  <div className="h-px bg-white/10"></div>
                  <ContactRow 
                  href={data.addressLink}
                  icon={<LocationIcon className="w-5 h-5" style={{color: styleOptions.accentColor}} />}
                  text={data.address}
                  ariaLabel={`Location: ${data.address}`}
                  />
              </section>
      
              {showSocialsSection && (
                  <>
                  <div className="my-6 pb-2"></div>
                  
                  <section className="flex justify-center items-center flex-wrap gap-x-4 gap-y-4">
                      {socials.linkedin.enabled && socials.linkedin.url && <a href={socials.linkedin.url} target="_blank" rel="noopener noreferrer" aria-label={`${name}'s LinkedIn Profile`} className="social-icon-link hover:text-[#0077B5]"> <LinkedInIcon className="w-6 h-6" /> </a>}
                      {socials.instagram.enabled && socials.instagram.url && <a href={socials.instagram.url} target="_blank" rel="noopener noreferrer" aria-label={`${name}'s Instagram Profile`} className="social-icon-link hover:text-[#E1306C]"> <InstagramIcon className="w-6 h-6" /> </a>}
                      {socials.whatsapp.enabled && socials.whatsapp.url && <a href={socials.whatsapp.url} target="_blank" rel="noopener noreferrer" aria-label={`Contact ${name} on WhatsApp`} className="social-icon-link hover:text-[#25D366]"> <WhatsAppIcon className="w-6 h-6" /> </a>}
                      {socials.facebook.enabled && socials.facebook.url && <a href={socials.facebook.url} target="_blank" rel="noopener noreferrer" aria-label={`${name}'s Facebook Profile`} className="social-icon-link hover:text-[#1877F2]"> <FacebookIcon className="w-6 h-6" /> </a>}
                      {socials.twitter.enabled && socials.twitter.url && <a href={socials.twitter.url} target="_blank" rel="noopener noreferrer" aria-label={`${name}'s X Profile`} className="social-icon-link hover:text-white"> <XIcon className="w-6 h-6" /> </a>}
                      {socials.youtube.enabled && socials.youtube.url && <a href={socials.youtube.url} target="_blank" rel="noopener noreferrer" aria-label={`${name}'s YouTube Channel`} className="social-icon-link hover:text-[#FF0000]"> <YouTubeIcon className="w-6 h-6" /> </a>}
                  </section>
                  </>
              )}
              <div className="pt-8 text-center text-xs font-semibold text-[#00D1A6] tracking-widest uppercase">
                MAKE WAVES
              </div>
            </div>
        </div>
      </div>
    );
};

export const CardBack: React.FC<{ data: ExecutiveData | null }> = ({ data }) => {
    if (!data) return null;
  
    return (
      <div className="w-full h-full card-face flex flex-col items-center justify-center p-8 text-center text-white font-sans premium-card-base rounded-3xl premium-card-bg">
        <div className="relative z-10 flex-grow flex flex-col items-center justify-center">
          {data.cardBackLogoUrl ? (
            <img 
              src={data.cardBackLogoUrl} 
              alt="Custom Card Back Logo" 
              className="object-contain"
                              style={{ width: `${data.cardBackLogoSize || 160}px`, height: `${data.cardBackLogoSize || 160}px` }}
            />
          ) : null}
        </div>
        <div className="relative z-10 text-xs font-semibold text-[#00D1A6] tracking-widest uppercase">
          MAKE WAVES
        </div>
      </div>
    );
  };