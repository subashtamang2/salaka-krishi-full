import AuthGuard from 'guards/AuthGuard';
import DashboardLayout from 'layout';
import { ConfirmProvider } from 'components/ConfirmDialog';


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <AuthGuard>
                <ConfirmProvider>
                    <DashboardLayout>
                        {children}
                    </DashboardLayout>
                </ConfirmProvider>
            </AuthGuard>
        </>
    );
}
