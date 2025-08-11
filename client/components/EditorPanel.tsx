import React from 'react';
import type { ExecutiveData, SocialLink } from '../types';
import { CollapsibleSection } from '../assets/icons';
import { LinkedInIcon, InstagramIcon, WhatsAppIcon, FacebookIcon, XIcon, YouTubeIcon } from '../assets/icons';
import { apiService } from '../services/api';

interface EditorPanelProps {
  card: ExecutiveData | null;
  onUpdate: (updates: Partial<ExecutiveData>) => void;
  hasUnsavedChanges?: boolean;
}

interface ImageUploadProps {
  label: string;
  currentUrl?: string;
  onUpload: (url: string) => void;
  accept?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ label, currentUrl, onUpload, accept = "image/*" }) => {
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const response = await apiService.uploadImage(file);
      
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        onUpload(response.data.url);
      }
    } catch (error) {
      setError('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      
      {currentUrl && (
        <div className="mb-3">
          <img 
            src={currentUrl} 
            alt="Current" 
            className="w-20 h-20 object-cover rounded-lg border border-gray-600"
          />
        </div>
      )}
      
      <div className="flex items-center gap-3">
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={isUploading}
          className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-700 file:text-gray-300 hover:file:bg-gray-600 disabled:opacity-50"
        />
        {isUploading && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="w-4 h-4 border-2 border-gray-600 border-t-green-500 rounded-full animate-spin"></div>
            Uploading...
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-dark-text-secondary mb-2">{label}</label>
        <input 
            id={id} 
            {...props} 
            autoComplete="off"
            spellCheck="false"
            className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-colors" 
        />
    </div>
);

const FileInputField: React.FC<{ label: string; id: string; currentImageUrl: string | null | undefined, onClear: () => void; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ label, id, currentImageUrl, onClear, onChange }) => {
    const [isUploading, setIsUploading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [success, setSuccess] = React.useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await apiService.uploadImage(file);
            
            if (response.error) {
                setError(response.error);
            } else if (response.data) {
                // Call the original onChange with the ImgBB URL
                const syntheticEvent = {
                    target: {
                        name: id,
                        value: response.data.url
                    }
                } as React.ChangeEvent<HTMLInputElement>;
                onChange(syntheticEvent);
                setSuccess('Image uploaded successfully!');
                // Clear success message after 3 seconds
                setTimeout(() => setSuccess(null), 3000);
            }
        } catch (error) {
            setError('Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-dark-text-secondary">{label}</label>
            <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg bg-dark-surface border-2 border-dashed border-dark-border flex items-center justify-center text-dark-text-secondary relative overflow-hidden flex-shrink-0">
                    {currentImageUrl ? (
                        <>
                            <img src={currentImageUrl} alt="Current" className="w-full h-full object-cover" />
                        </>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" /></svg>
                    )}
                    {isUploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label htmlFor={id} className={`cursor-pointer bg-dark-panel hover:bg-dark-border/70 text-dark-text-primary font-semibold py-2 px-4 rounded-lg transition-colors text-sm text-center ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {isUploading ? 'Uploading...' : (currentImageUrl ? 'Change Image' : 'Upload Image')}
                    </label>
                    {currentImageUrl && (
                        <button 
                            onClick={onClear} 
                            className="text-xs text-red-400 hover:text-red-300 hover:underline text-center transition-colors"
                        >
                            Remove
                        </button>
                    )}
                    <input id={id} type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={isUploading} />
                </div>
            </div>
            {error && (
                <p className="text-sm text-red-400">{error}</p>
            )}
            {success && (
                <p className="text-sm text-green-400">{success}</p>
            )}
        </div>
    );
};

const socialIcons: Record<string, React.FC<{ className?: string }>> = {
    linkedin: LinkedInIcon,
    instagram: InstagramIcon,
    twitter: XIcon,
    youtube: YouTubeIcon,
    facebook: FacebookIcon,
    whatsapp: WhatsAppIcon,
};


export const EditorPanel: React.FC<EditorPanelProps> = ({ card, onUpdate, hasUnsavedChanges }) => {
    if (!card) {
        return (
            <div className="bg-dark-surface rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-sm mx-auto flex items-center justify-center font-sans text-dark-text-secondary h-full">
                No card selected. Please select or create a card to edit.
            </div>
        );
    }

    // Safety check for styleOptions
    const styleOptions = card.styleOptions || { accentColor: 'rgba(0,167,128,255)' };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        
        if (name.includes('.')) {
            // Handle nested properties like socials.linkedin.url
            const [parent, child] = name.split('.');
            const parentObj = card[parent as keyof ExecutiveData] as any;
            onUpdate({
                ...card,
                [parent]: {
                    ...parentObj,
                    [child]: type === 'checkbox' ? checked : value
                }
            });
        } else {
            onUpdate({ ...card, [name]: type === 'checkbox' ? checked : value });
        }
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // This function is now handled by the FileInputField component with ImgBB integration
        // The field and value are passed through the synthetic event
        const fieldName = e.target.name as 'profilePictureUrl' | 'companyLogoUrl' | 'cardBackLogoUrl';
        const value = e.target.value;
        onUpdate({ ...card, [fieldName]: value });
    };

    const handleClearFile = (field: 'profilePictureUrl' | 'companyLogoUrl' | 'cardBackLogoUrl') => {
         onUpdate({ ...card, [field]: null });
    };

    const handleSocialChange = (platform: keyof ExecutiveData['socials'], field: keyof SocialLink, value: string | boolean) => {
        onUpdate({
            ...card,
            socials: {
                ...card.socials,
                [platform]: {
                    ...card.socials[platform],
                    [field]: value,
                },
            },
        });
    };
    
    const handleSliderChange = (field: 'companyLogoSize' | 'cardBackLogoSize', value: string) => {
        onUpdate({ ...card, [field]: Number(value) });
    };

    const handlePositionChange = (axis: 'x' | 'y', value: string) => {
        onUpdate({
            ...card,
            companyLogoPosition: {
                ...card.companyLogoPosition || { x: 50, y: 50 },
                [axis]: Number(value),
            },
        });
    };
    
    const handleStyleChange = (field: keyof ExecutiveData['styleOptions'], value: string) => {
        onUpdate({ ...card, styleOptions: { ...styleOptions, [field]: value } });
    }

    return (
        <div className="space-y-8">
            {hasUnsavedChanges && (
                <div className="bg-yellow-600/10 border border-yellow-600/20 rounded-lg p-4 flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span className="text-yellow-500 font-medium text-sm">You have unsaved changes</span>
                </div>
            )}
            <CollapsibleSection title="Personal Details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Full Name" name="name" value={card.name} onChange={handleChange} />
                    <InputField label="Title" name="title" value={card.title} onChange={handleChange} />
                    <InputField label="Phone" name="phone" type="tel" value={card.phone} onChange={handleChange} />
                    <InputField label="Email" name="email" type="email" value={card.email} onChange={handleChange} />
                    <div className="md:col-span-2">
                      <InputField label="Address" name="address" value={card.address} onChange={handleChange} />
                    </div>
                    <div className="md:col-span-2">
                      <InputField label="Address Link (e.g. Google Maps)" name="addressLink" value={card.addressLink} onChange={handleChange} />
                    </div>
                     <div className="md:col-span-2">
                      <InputField label="Booking Link (e.g. Calendly)" name="calendlyLink" value={card.calendlyLink} onChange={handleChange} />
                    </div>
                    <div className="md:col-span-2">
                       <FileInputField 
                        label="Profile Picture" 
                        id="profilePictureUrl" 
                        currentImageUrl={card.profilePictureUrl}
                        onClear={() => handleClearFile('profilePictureUrl')}
                        onChange={(e) => handleFileChange(e)} 
                        />
                    </div>
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Company Details">
                 <div className="space-y-6">
                     <InputField label="Company Name" name="companyName" value={card.companyName} onChange={handleChange} />
                     <InputField label="Company Website" name="companyWebsite" value={card.companyWebsite} onChange={handleChange} />
                     <FileInputField 
                        label="Company Logo (Front)" 
                        id="companyLogoUrl" 
                        currentImageUrl={card.companyLogoUrl}
                        onClear={() => handleClearFile('companyLogoUrl')}
                        onChange={(e) => handleFileChange(e)} 
                     />
                     {card.companyLogoUrl && (
                        <div className="space-y-4 pt-4 mt-4 border-t border-dark-border/50">
                            <div>
                                <label className="block text-sm font-medium text-dark-text-secondary mb-2">Logo Size ({card.companyLogoSize}px)</label>
                                <input type="range" min="50" max="250" value={card.companyLogoSize} onChange={(e) => handleSliderChange('companyLogoSize', e.target.value)} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-dark-text-secondary mb-2">Logo Horizontal ({card.companyLogoPosition?.x || 50}%)</label>
                                    <input type="range" min="0" max="100" value={card.companyLogoPosition?.x || 50} onChange={(e) => handlePositionChange('x', e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-dark-text-secondary mb-2">Logo Vertical ({card.companyLogoPosition?.y || 50}%)</label>
                                    <input type="range" min="0" max="100" value={card.companyLogoPosition?.y || 50} onChange={(e) => handlePositionChange('y', e.target.value)} />
                                </div>
                            </div>
                        </div>
                     )}
                 </div>
            </CollapsibleSection>

            <CollapsibleSection title="Social Links">
                 <div className="grid grid-cols-1 gap-4">
                    {Object.keys(card.socials).map((platform) => {
                        const Icon = socialIcons[platform as keyof typeof socialIcons];
                        const key = platform as keyof typeof card.socials;
                        return (
                            <div key={platform} className="flex items-center gap-4">
                                <input
                                    type="checkbox"
                                    id={`social-enabled-${platform}`}
                                    checked={card.socials[key].enabled}
                                    onChange={(e) => handleSocialChange(key, 'enabled', e.target.checked)}
                                />
                                <div className="flex items-center gap-3 text-dark-text-primary/80 w-32 capitalize">
                                    {Icon && <Icon className="w-5 h-5"/>}
                                    <span>{platform}</span>
                                </div>
                                <input 
                                    id={`social-url-${platform}`}
                                    value={card.socials[key].url}
                                    onChange={(e) => handleSocialChange(key, 'url', e.target.value)}
                                    disabled={!card.socials[key].enabled}
                                    className="flex-1 bg-dark-surface border border-dark-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                    placeholder={`Enter ${platform} URL`}
                                />
                            </div>
                        );
                    })}
                 </div>
            </CollapsibleSection>

            <CollapsibleSection title="Card Styling & Text">
                <div className="space-y-6">
                     <InputField label="Meeting Button Text" name="meetingButtonText" value={card.meetingButtonText} onChange={handleChange} />
                     <InputField label="Save Contact Button Text" name="saveContactButtonText" value={card.saveContactButtonText} onChange={handleChange} />
                     <div className="flex items-center gap-4">
                        <label htmlFor="accentColor" className="block text-sm font-medium text-dark-text-secondary">Accent Color</label>
                        <div className="relative">
                            <input type="color" id="accentColor" value={styleOptions.accentColor} onChange={(e) => handleStyleChange('accentColor', e.target.value)} className="w-10 h-10 p-0 border-none bg-transparent appearance-none cursor-pointer absolute opacity-0 inset-0" />
                            <div className="w-10 h-10 rounded-lg border-2 border-dark-border ring-2 ring-offset-2 ring-offset-dark-panel ring-transparent" style={{ backgroundColor: styleOptions.accentColor }}></div>
                        </div>
                     </div>
                </div>
            </CollapsibleSection>

             <CollapsibleSection title="Advanced Customization">
                <div className="space-y-6">
                    <FileInputField 
                        label="Card Back Logo" 
                        id="cardBackLogoUrl" 
                        currentImageUrl={card.cardBackLogoUrl}
                        onClear={() => handleClearFile('cardBackLogoUrl')}
                        onChange={(e) => handleFileChange(e)} 
                    />
                    {card.cardBackLogoUrl && (
                        <div>
                                                            <label className="block text-sm font-medium text-dark-text-secondary mb-2">Back Logo Size ({card.cardBackLogoSize || 160}px)</label>
                                <input type="range" min="50" max="250" value={card.cardBackLogoSize || 160} onChange={(e) => handleSliderChange('cardBackLogoSize', e.target.value)} />
                        </div>
                    )}
                </div>
            </CollapsibleSection>
        </div>
    );
};