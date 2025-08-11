'use client';

import { ConfigContext } from '@/context/ConfigContext';

export default function ConfigProvider({ config, children }) {
    return (
        <ConfigContext.Provider value={config}>
            {children}
        </ConfigContext.Provider>
    );
}
