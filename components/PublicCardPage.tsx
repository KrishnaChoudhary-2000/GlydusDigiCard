

import React, { useState } from 'react';
import { CardPreview } from './Card';
import type { ExecutiveData } from '../types';
import { Icons } from './AppUI';

interface PublicCardPageProps {
    data: ExecutiveData;
}

export const PublicCardPage: React.FC<PublicCardPageProps> = ({ data }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div className="min-h-screen w-full bg-dark-bg flex flex-col items-center justify-center p-4 text-center font-sans">
            <div className="w-full max-w-sm h-auto perspective">
                <div className={`card-flipper ${isFlipped ? 'is-flipped' : ''} w-full relative`}>
                    <div className="card-front w-full">
                        <CardPreview data={data} onUpdate={() => {}} />
                    </div>
                    <div className="card-back absolute w-full h-full top-0 left-0">
                        <div className="premium-card-base premium-card-bg relative overflow-hidden rounded-2xl p-6">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-white mb-4">Digital Business Card</h2>
                                <p className="text-gray-300 mb-6">Scan or tap to connect</p>
                                <div className="text-center">
                                    <p className="text-[#00D1A6] font-semibold">MAKE WAVES</p>
                                    <p className="text-gray-400 text-sm mt-2">Powered by Glydus</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <button 
                onClick={() => setIsFlipped((f: boolean) => !f)}
                className="mt-8 flex items-center gap-2 bg-dark-surface hover:bg-dark-panel text-dark-text-primary font-semibold py-2 px-4 border border-dark-border rounded-lg shadow-sm transition-colors duration-200"
            >
                <Icons.flip />
                Flip Card
            </button>
        </div>
    );
};