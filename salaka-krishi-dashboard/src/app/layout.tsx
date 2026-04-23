import type { Metadata } from 'next';
import ProviderWrapper from './ProviderWrapper';

export const metadata: Metadata = {
    title: 'Salaka Krishi CMS',
    description: 'A content management system for Salaka Krishi',
    icons: {
        icon: "/assets/images/logo/icon-256x256.svg",
        shortcut: "/assets/images/logo/icon-256x256.svg",
        apple: "/assets/images/logo/icon-256x256.svg",
    },
};

export default async function RootLayout({ children }: { children: React.ReactElement }) {
    return (
        <html lang="en">
            <body suppressHydrationWarning={true}>
                <ProviderWrapper>
                    {children}
                </ProviderWrapper>
            </body>
        </html>
    );
}
