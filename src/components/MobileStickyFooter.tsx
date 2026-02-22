'use client';

import { ReactNode } from 'react';

interface MobileStickyFooterProps {
    children: ReactNode;
}

export default function MobileStickyFooter({ children }: MobileStickyFooterProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-[#0f172a]/95 backdrop-blur-lg border-t border-slate-700/50 lg:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)] safe-area-bottom">
            <div className="max-w-md mx-auto">
                {children}
            </div>
        </div>
    );
}
