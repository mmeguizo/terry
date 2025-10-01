'use client';

import { ConfigContext } from '@/context/ConfigContext';
import { useEffect } from 'react';
import { applySmartTheming } from '@/utils/smartTheming';

export default function ConfigProvider({ config, children }) {
    // Apply smart theming when config changes
    useEffect(() => {
        if (config && config.primaryColor) {
            applySmartTheming(config);
        }
    }, [config]);

    return (
        <ConfigContext.Provider value={config}>
            {children}
        </ConfigContext.Provider>
    );
}
