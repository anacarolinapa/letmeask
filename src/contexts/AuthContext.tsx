import { createContext, ReactNode, useState, useEffect } from "react";
import { auth, firebase } from '../services/firebase';

type User = {
    id: string;
    name: string;
    avatar: string;
}

type AuthContextType = {
    user: User | undefined,
    signInWithGoogle: () => Promise<void>
}

type AuthContextProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {
    const [user, setUser] = useState<User>();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                // DEFINIR DADOS DO USUÁRIO
                const { displayName, photoURL, uid } = user;

                // VERIFICAR SE DADOS EXISTEM
                if (!displayName || !photoURL) {
                    throw new Error('Falta informação da conta do Google.');
                }

                // SETAR DADOS DO USUÁRIO
                setUser({
                    id: uid,
                    name: displayName,
                    avatar: photoURL
                });
            }
        });

        return () => {
            unsubscribe();
        }
    }, []);

    async function signInWithGoogle() {
        // AUTENTICAR USUÁRIO
        var provider = new firebase.auth.GoogleAuthProvider();

        // ABRIR TELA DE LOGIN DO GOOGLE COMO POPUP
        const result = await auth.signInWithPopup(provider);

        // VERIFICAR SE O USUÁRIO FEZ LOGIN
        if (result.user) {
            // DEFINIR DADOS DO USUÁRIO
            const { displayName, photoURL, uid } = result.user;

            // VERIFICAR SE DADOS EXISTEM
            if (!displayName || !photoURL) {
                throw new Error('Falta informação da conta do Google.');
            }

            // SETAR DADOS DO USUÁRIO
            setUser({
                id: uid,
                name: displayName,
                avatar: photoURL
            });
        }
    }

    return (
        <AuthContext.Provider value={{ user, signInWithGoogle }}>
            {props.children}
        </AuthContext.Provider>
    );
}