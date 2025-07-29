import React from 'react';
import { GlydusLogo } from '../assets/icons';

// --- ICONS ---

export const Icons = {
    glydus: (props: {className?: string}) => <GlydusLogo {...props} />,
    add: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
    trash: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
    eye: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
    share: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" /></svg>,
    save: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>,
    copy: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
    check: (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
    flip: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5"/></svg>,
    phone: (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" {...props}><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.518.759a11.03 11.03 0 004.28 4.28l.759-1.518a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>,
    email: (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" {...props}><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>,
    address: (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" {...props}><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>,
    linkedin: () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.25 6.5 1.75 1.75 0 016.5 8.25zM19 19h-3v-4.74c0-1.42-.6-2.16-1.9-2.16-1.5 0-2.1.9-2.1 2.16V19h-3v-9h2.9v1.3a3.1 3.1 0 012.8-1.5c2.2 0 3.4 1.4 3.4 4.3z"></path></svg>,
    instagram: () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 011.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122s-.013 3.056-.06 4.122c-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772 4.915 4.915 0 01-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06s-3.056-.013-4.122-.06c-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12s.013-3.056.06-4.122c.05-1.065.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.905 4.905 0 015.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm6.5-3a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"></path></svg>,
    twitter: () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616v.064c0 2.296 1.634 4.208 3.803 4.649-.6.162-1.234.248-1.885.248-.306 0-.6-.03-1.04-.094.628 1.956 2.448 3.379 4.604 3.419-1.79 1.406-4.062 2.246-6.522 2.246-.42 0-.834-.025-1.24-.073 2.323 1.498 5.084 2.373 8.041 2.373 9.643 0 14.931-7.998 14.628-14.655.992-.716 1.85-1.61 2.532-2.62z"></path></svg>,
    youtube: () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path></svg>,
    facebook: () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path></svg>,
    whatsapp: () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.38 1.25 4.81L2 22l5.42-1.39c1.37.71 2.92 1.12 4.58 1.12h.04c5.46 0 9.91-4.45 9.91-9.91s-4.45-9.91-9.91-9.91zM17.16 15.4c-.18.47-.94 1-1.28 1.04-.32.04-1.12-.11-2.22-1.11-1.4-.95-2.3-2.18-2.42-2.37-.12-.19-.88-1.19-.88-2.25s.5-1.57.69-1.78c.19-.21.43-.27.57-.27.15,0,.3-.01.43-.01.16,0,.36.06.54.34.18.27.63 1.54.69 1.66.06.12.11.27,0,.42-.12.16-.18.27-.36.47s-.3.34-.43.43c-.14.09-.27.19-.13.39.19.27.83 1.25 1.78 2.12.95.87 1.73.95 1.98 1.06.25.11.41.09.57-.06.19-.18.82-.99.97-1.32.16-.33.33-.27.54-.16.21.11,1.33.63,1.57.75.24.12.39.18.45.27.06.09,0,.47-.18.94z"></path></svg>,
};


// --- HEADER ---

interface HeaderProps {
    onPreviewClick: () => void;
    onShareClick: () => void;
    onSaveClick: () => void;
    hasUnsavedChanges: boolean;
}
export const Header: React.FC<HeaderProps> = ({ onPreviewClick, onShareClick, onSaveClick, hasUnsavedChanges }) => (
    <header className="bg-dark-bg/50 backdrop-blur-xl sticky top-0 z-40 border-b border-dark-border">
        <div className="mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between h-24">
                <Icons.glydus />
                <div className="flex items-center gap-3">
                    <button onClick={onPreviewClick} className="flex items-center gap-2 bg-dark-surface hover:bg-dark-panel text-dark-text-primary font-semibold py-2.5 px-5 border border-dark-border rounded-lg shadow-sm transition-all duration-300 text-sm ring-1 ring-transparent hover:ring-dark-border">
                        <Icons.eye />
                        <span className="hidden sm:inline">Preview</span>
                    </button>
                    <button 
                        onClick={onSaveClick} 
                        disabled={!hasUnsavedChanges}
                        title={hasUnsavedChanges ? "Save changes (Ctrl+S)" : "No changes to save"}
                        className={`flex items-center gap-2 font-semibold py-2.5 px-5 border rounded-lg shadow-sm transition-all duration-300 text-sm ${
                            hasUnsavedChanges 
                                ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' 
                                : 'bg-dark-surface text-dark-text-secondary border-dark-border cursor-not-allowed'
                        }`}
                    >
                        <Icons.save />
                        <span className="hidden sm:inline">Save</span>
                    </button>
                    <button onClick={onShareClick} className="flex items-center gap-2 bg-brand-accent hover:bg-brand-accent-hover text-white font-semibold py-2.5 px-5 border border-transparent rounded-lg shadow-sm transition-colors duration-300 text-sm">
                        <Icons.share />
                        <span className="hidden sm:inline">Share</span>
                    </button>
                </div>
            </div>
        </div>
    </header>
);

// --- TOAST ---

interface ToastProps {
    message: string;
    show: boolean;
    onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, show, onDismiss }) => {
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
        if (show) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(onDismiss, 500); 
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [show, onDismiss]);
    
    if (!show) return null;

    return (
        <div 
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-dark-panel border border-dark-border text-dark-text-primary py-3 px-6 rounded-lg shadow-2xl flex items-center gap-4 ${isVisible ? 'animate-toast-in' : 'animate-toast-out'}`}
        >
            <Icons.check className="text-green-400" />
            <span className="font-semibold text-sm">{message}</span>
        </div>
    );
};


// --- COLLAPSIBLE SECTION ---

interface CollapsibleSectionProps {
    title: string;
    children: React.ReactNode;
}
export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, children }) => (
    <details className="bg-dark-panel/50 rounded-xl border border-dark-border overflow-hidden transition-all duration-300 group" open>
        <summary className="font-semibold text-lg p-5 cursor-pointer hover:bg-white/5 transition-colors duration-200 flex justify-between items-center list-none">
            {title}
            <svg className="w-5 h-5 text-dark-text-secondary transition-transform duration-300 transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
        </summary>
        <div className="p-5 border-t border-dark-border bg-dark-surface/30">
            {children}
        </div>
    </details>
);