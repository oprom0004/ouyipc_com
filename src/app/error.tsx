'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div style={{ padding: '40px', textAlign: 'center', color: 'white' }}>
            <h2>Something went wrong!</h2>
            <p className="text-red-500">{error.message}</p>
            <button
                onClick={() => reset()}
                className="mt-4 px-4 py-2 bg-blue-600 rounded text-white"
            >
                Try again
            </button>
        </div>
    );
}
