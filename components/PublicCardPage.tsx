

import React, { useState } from 'react';
import { ExecutiveData } from '../types';
import { CardPreview, CardBack } from './Card';
import { Icons } from './AppUI';

interface PublicCardPageProps {
    data: ExecutiveData;
}

export const PublicCardPage: React.FC<PublicCardPageProps> = ({ data }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div className="min-h-screen w-full bg-brand-dark flex flex-col items-center gap-8 p-4">
            <div className="absolute top-4 left-4">
                 <Icons.glydus />
            </div>
            <div className="w-full max-w-sm h-auto perspective mt-auto">
                <div className={`card-flipper ${isFlipped ? 'is-flipped' : ''} w-full relative`}>
                    <div className="card-front w-full">
                       <CardPreview data={data} onUpdate={() => {}} />
                    </div>
                    <div className="card-back absolute w-full h-full top-0 left-0">
                       <CardBack data={data} />
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center gap-4 mb-auto">
                <button 
                    onClick={() => setIsFlipped(f => !f)}
                    className="flex items-center gap-2 bg-brand-surface hover:bg-brand-border text-white font-semibold py-2 px-4 border border-brand-border rounded-lg shadow-sm transition-colors duration-200"
                >
                    <Icons.flip />
                    Flip Card
                </button>
                <div className="text-xs text-brand-muted text-center">
                    <p>Digital Business Card</p>
                    <p>Powered by Glydus</p>
                </div>
            </div>
        </div>
    );
};