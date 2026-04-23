import PublicGuard from 'guards/PublicGuard';
import Login from 'views/authentication/Login';

export default function HomePage() {
    return (
        <>
            <PublicGuard>
                <Login />
            </PublicGuard>
        </>
    );
}
