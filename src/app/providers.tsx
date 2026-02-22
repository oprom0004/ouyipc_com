'use client';

import { GatewayProvider } from '@/features/DownloadGateway/GatewayContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <GatewayProvider>
            {children}
        </GatewayProvider>
    );
}
