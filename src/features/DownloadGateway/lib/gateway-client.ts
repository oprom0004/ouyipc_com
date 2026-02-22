// Basic mock client for development/production fallback
export interface GatewayConfig {
    web: { china: string; global: string; html: string };
    android: { china: string; global: string; version: string };
    ios: { china: string; global: string; };
}

export async function fetchGatewayConfig(): Promise<GatewayConfig> {
    console.log("Loading Gateway Config...");
    return {
        web: {
            china: 'https://www.okx.com',
            global: 'https://www.okx.com',
            html: ''
        },
        android: {
            china: 'https://static.okx.com/cdn/assets/academy/2026/okx-android.apk',
            global: 'https://www.okx.com/download',
            version: '6.45.0'
        },
        ios: {
            china: 'https://www.okx.com/download',
            global: 'https://www.okx.com/download'
        }
    };
}
