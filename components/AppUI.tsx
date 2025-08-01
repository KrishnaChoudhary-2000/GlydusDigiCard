import React from 'react';

// --- ICONS ---
export const Icons = {
  add: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  trash: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  glydus: ({ className = "w-8 h-8" }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  ),
  flip: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  ),
  copy: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  check: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  share: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
    </svg>
  ),
  close: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
};

// --- HEADER COMPONENT ---
interface HeaderProps {
  onPreviewClick: () => void;
  onShareClick: () => void;
  onSaveClick: () => void;
  hasUnsavedChanges: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onPreviewClick, onShareClick, onSaveClick, hasUnsavedChanges }) => (
  <header className="bg-dark-surface border-b border-dark-border px-6 py-4 flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="flex flex-col">
        <h1 className="text-xl font-bold text-dark-text-primary">GLYDUS</h1>
        <span style={{ color: '#00d1a6', fontWeight: 600, fontSize: '1rem', lineHeight: 1.2 }}>Make Waves</span>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <button
        onClick={onPreviewClick}
        className="px-4 py-2 bg-dark-panel hover:bg-dark-panel/80 text-dark-text-primary rounded-lg font-semibold transition-all duration-200 flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        Preview
      </button>
      <button
        onClick={onSaveClick}
        disabled={!hasUnsavedChanges}
        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
          !hasUnsavedChanges
            ? 'bg-dark-panel text-dark-text-secondary cursor-not-allowed'
            : 'bg-brand-accent hover:bg-brand-accent-hover text-white shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20'
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        Save
      </button>
      <button
        onClick={onShareClick}
        className="px-4 py-2 bg-brand-accent hover:bg-brand-accent-hover text-white rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20"
      >
        <Icons.share />
        Share
      </button>
    </div>
  </header>
);

// --- TOAST COMPONENT ---
interface ToastProps {
  message: string;
  show: boolean;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, show, onDismiss }) => {
  React.useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onDismiss]);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-toast-in">
      <div className="bg-dark-surface border border-dark-border rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-center justify-between">
          <span className="text-dark-text-primary">{message}</span>
          <button
            onClick={onDismiss}
            className="ml-4 text-dark-text-secondary hover:text-dark-text-primary transition-colors"
          >
            <Icons.close />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- COLLAPSIBLE SECTION COMPONENT ---
interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
  title, 
  children, 
  defaultOpen = true 
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className="mb-6">
      <details open={isOpen} className="group">
        <summary 
          className="flex items-center justify-between cursor-pointer list-none p-4 bg-dark-panel hover:bg-dark-panel/80 transition-colors rounded-lg mb-4"
          onClick={(e) => {
            e.preventDefault();
            setIsOpen(!isOpen);
          }}
        >
          <h3 className="text-lg font-semibold text-dark-text-primary">{title}</h3>
          <svg 
            className={`w-5 h-5 text-dark-text-secondary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div className={`transition-all duration-200 ${isOpen ? 'opacity-100 max-h-none' : 'opacity-0 max-h-0 overflow-hidden'}`}>
          <div className="p-4 bg-dark-surface rounded-lg border border-dark-border">
            {children}
          </div>
        </div>
      </details>
    </div>
  );
}; 