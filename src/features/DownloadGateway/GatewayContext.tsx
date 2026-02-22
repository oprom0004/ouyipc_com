'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import DownloadGateway from './components/DownloadGateway';

interface GatewayContextType {
    openGateway: () => void;
    closeGateway: () => void;
}

const GatewayContext = createContext<GatewayContextType | undefined>(undefined);

export function GatewayProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    const openGateway = () => setIsOpen(true);
    const closeGateway = () => setIsOpen(false);

    return (
        <GatewayContext.Provider value={{ openGateway, closeGateway }}>
            {children}
            <DownloadGateway
                isOpen={isOpen}
                onClose={closeGateway}
            />
        </GatewayContext.Provider>
    );
}

export function useGateway() {
    const context = useContext(GatewayContext);
    if (context === undefined) {
        throw new Error('useGateway must be used within a GatewayProvider');
    }
    return context;
}

interface GatewayTriggerProps {
    children: ReactNode;
    className?: string; // Allow custom styling
    asChild?: boolean; // Currently not implemented fully, but good for future compatibility
    onClick?: (e: React.MouseEvent) => void;
}

export function GatewayTrigger({ children, className, onClick, ...props }: GatewayTriggerProps) {
    const { openGateway } = useGateway();

    const handleClick = (e: React.MouseEvent) => {
        if (onClick) onClick(e);
        openGateway();
    };

    return (
        <button className={className} onClick={handleClick} {...props}>
            {children}
        </button>
    );
}
