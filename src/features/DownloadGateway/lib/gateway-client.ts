import { GATEWAY_CONFIG } from '../config/gateway.config';
import { FALLBACK_DATA, GatewayConfig } from '../config/fallback-data';

export type { GatewayConfig };

/**
 * Fetch download links configuration from the Gateway API.
 * 自动轮询配置的多个 Worker 节点。
 * 当所有节点都失败时，才降级到本地 Fallback 数据。
 */
export async function fetchGatewayConfig(): Promise<GatewayConfig> {
    const { endpoints } = GATEWAY_CONFIG.gateway;

    // Use fallback data if no endpoints configured
    if (!endpoints || endpoints.length === 0) {
        // Simulate network delay for realistic experience
        await new Promise(resolve => setTimeout(resolve, 300));
        return FALLBACK_DATA;
    }

    // Try each endpoint in order (Failover Strategy)
    for (const url of endpoints) {
        if (!url) continue;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Accept': 'application/json' },
                cache: 'no-store',
            });

            if (response.ok) {
                const data = await response.json();
                return data; // Success! Return immediately.
            } else {
                console.warn(`Gateway fetch failed for ${url}: ${response.status}`);
            }
        } catch (error) {
            console.warn(`Gateway connection error for ${url}:`, error);
            // Continue to next endpoint...
        }
    }

    // If we get here, ALL endpoints failed.
    console.error('All gateway endpoints failed. Falling back to local data.');
    return FALLBACK_DATA;
}
