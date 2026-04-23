'use client';

import { ReactElement } from 'react';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function ProviderWrapper({ children }: { children: ReactElement }) {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeCustomization>
                <ScrollTop>
                    {children}
                </ScrollTop>
            </ThemeCustomization>
        </QueryClientProvider>
    );
}
