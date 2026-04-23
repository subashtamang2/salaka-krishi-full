import { setAccessToken, setRefreshToken } from '@src/utils/local-storage';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';


export default function LoginSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    useEffect(() => {
        const access_token = searchParams.get('access_token');
        const refresh_token = searchParams.get('refresh_token');
        if (access_token && refresh_token) {
            setAccessToken(access_token);
            setRefreshToken(refresh_token);
            navigate('/');
        }
    }, [searchParams, navigate])
    return (
        <>
            <div>Logging you in...</div>
        </>
    );
}
