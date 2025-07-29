import React, { useState } from 'react';
import type { ExecutiveData } from '../types';
import { CollapsibleSection } from './AppUI';

interface EditorPanelProps {
    card: ExecutiveData | null;
    onUpdate: (updates: Partial<ExecutiveData>) => void;
    hasUnsavedChanges?: boolean;
}

interface FileInputFieldProps {
    label: string;
    currentUrl: string;
    onUpload: (url: string) => void;
    accept?: string;
}

const FileInputField: React.FC<FileInputFieldProps> = ({ label, currentUrl, onUpload, accept = "image/*" }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setError(null);
        setSuccess(false);

        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('key', 'a4ffb711bb7e22187e16d0a6398d35d0');

            const response = await fetch('https://api.imgbb.com/1/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                onUpload(data.data.url);
                setSuccess(true);
                setTimeout(() => setSuccess(false), 2000);
            } else {
                setError('Failed to upload image');
            }
        } catch (error) {
            setError('Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-2">{label}</label>
            <div className="flex items-center space-x-3">
                <input
                    type="file"
                    accept={accept}
                    onChange={handleFileChange}
                    className="hidden"
                    id={`file-${label.toLowerCase().replace(/\s+/g, '-')}`}
                />
                <label
                    htmlFor={`file-${label.toLowerCase().replace(/\s+/g, '-')}`}
                    className="cursor-pointer bg-dark-panel hover:bg-dark-border text-white px-4 py-2 rounded-lg border border-dark-border transition-colors"
                >
                    {isUploading ? (
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
                            <span>Uploading...</span>
                        </div>
                    ) : (
                        'Choose File'
                    )}
                </label>
                {currentUrl && (
                    <span className="text-green-400 text-sm">✓ Uploaded</span>
                )}
                {error && (
                    <span className="text-red-400 text-sm">{error}</span>
                )}
                {success && (
                    <span className="text-green-400 text-sm">✓ Success!</span>
                )}
            </div>
        </div>
    );
};

export const EditorPanel: React.FC<EditorPanelProps> = ({ card, onUpdate, hasUnsavedChanges }) => {
    if (!card) return null;

    const handleChange = (field: keyof ExecutiveData, value: string) => {
        onUpdate({ [field]: value } as Partial<ExecutiveData>);
    };

    const handleSocialChange = (platform: keyof typeof card.socials, field: 'url' | 'enabled', value: string | boolean) => {
        onUpdate({
            socials: {
                ...card.socials,
                [platform]: {
                    ...card.socials[platform],
                    [field]: value
                }
            }
        });
    };

    const handleColorChange = (value: string) => {
        onUpdate({ accentColor: value });
    };

    return (
        <div className="flex-1 overflow-y-auto p-6 bg-dark-surface">
            {hasUnsavedChanges && (
                <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                    <p className="text-yellow-400 text-sm">You have unsaved changes</p>
                </div>
            )}

            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-white">Edit Your Card</h1>
                <p className="text-gray-300">Customize your digital business card</p>

                <CollapsibleSection title="Basic Information">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-white text-sm font-medium mb-2">Card Name</label>
                            <input
                                type="text"
                                value={card.cardName}
                                onChange={(e) => handleChange('cardName', e.target.value)}
                                className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
                            />
                        </div>

                        <div>
                            <label className="block text-white text-sm font-medium mb-2">Full Name</label>
                            <input
                                type="text"
                                value={card.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
                            />
                        </div>

                        <div>
                            <label className="block text-white text-sm font-medium mb-2">Title</label>
                            <input
                                type="text"
                                value={card.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
                            />
                        </div>

                        <div>
                            <label className="block text-white text-sm font-medium mb-2">Email</label>
                            <input
                                type="email"
                                value={card.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
                            />
                        </div>

                        <div>
                            <label className="block text-white text-sm font-medium mb-2">Phone</label>
                            <input
                                type="tel"
                                value={card.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
                            />
                        </div>

                        <div>
                            <label className="block text-white text-sm font-medium mb-2">Address</label>
                            <textarea
                                value={card.address}
                                onChange={(e) => handleChange('address', e.target.value)}
                                rows={3}
                                className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
                            />
                        </div>
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title="Images">
                    <div className="space-y-4">
                        <FileInputField
                            label="Profile Picture"
                            currentUrl={card.profilePicture}
                            onUpload={(url) => handleChange('profilePicture', url)}
                        />

                        <FileInputField
                            label="Company Logo"
                            currentUrl={card.companyLogo}
                            onUpload={(url) => handleChange('companyLogo', url)}
                        />

                        <FileInputField
                            label="Card Back Logo"
                            currentUrl={card.cardBackLogoUrl}
                            onUpload={(url) => handleChange('cardBackLogoUrl', url)}
                        />
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title="Social Media">
                    <div className="space-y-4">
                        {Object.keys(card.socials).map((platform) => {
                            const key = platform as keyof typeof card.socials;
                            const social = card.socials[key];
                            
                            return (
                                <div key={platform} className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        checked={social.enabled}
                                        onChange={(e) => handleSocialChange(key, 'enabled', e.target.checked)}
                                        className="rounded border-dark-border bg-dark-bg text-brand-accent focus:ring-brand-accent"
                                    />
                                    <input
                                        type="url"
                                        value={social.url}
                                        onChange={(e) => handleSocialChange(key, 'url', e.target.value)}
                                        placeholder={`${platform} URL`}
                                        className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
                                    />
                                </div>
                            );
                        })}
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title="Styling">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-white text-sm font-medium mb-2">Accent Color</label>
                            <div className="flex items-center space-x-3">
                                <input
                                    type="color"
                                    value={card.accentColor}
                                    onChange={(e) => handleColorChange(e.target.value)}
                                    className="w-12 h-10 rounded border border-dark-border bg-transparent cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={card.accentColor}
                                    onChange={(e) => handleColorChange(e.target.value)}
                                    className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
                                />
                            </div>
                        </div>
                    </div>
                </CollapsibleSection>
            </div>
        </div>
    );
};