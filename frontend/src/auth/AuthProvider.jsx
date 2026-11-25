import { useCallback, useEffect, useMemo, useState } from 'react';
import { authRequest } from '../services/api';
import AuthContext from '../context/AuthContext';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(undefined);
    const isLoading = user === undefined;

    useEffect(() => {
        let isMounted = true;
        authRequest('me')
            .then((result) => {
                if (isMounted) {
                    setUser(result.user);
                }
            })
            .catch((error) => {
                if (error.status !== 401) {
                    console.error('Could not load the current user:', error);
                }
                if (isMounted) {
                    setUser(null);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const signIn = useCallback(async (mode, values) => {
        const result = await authRequest(mode, {
            method: 'POST',
            body: JSON.stringify(values),
        });
        setUser(result.user);
        return result.user;
    }, []);

    const signOut = useCallback(async () => {
        await authRequest('logout', { method: 'POST' });
        setUser(null);
    }, []);

    const value = useMemo(() => ({
        user,
        isLoading,
        signIn,
        signOut,
    }), [user, isLoading, signIn, signOut]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
