'use client'

import { app } from '@/lib/firebaseClient';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import React from 'react';
import { createPublishDoc } from '@/lib/contentfulCMA';
import { toField } from '@/lib/contentfulClientUtils';
import { getProfile } from './contenfulCDN';

const auth = getAuth(app);

export async function createUser(data: any) {
    return createUserFirebase(data.email, data.password)
    .then((userCredential) => {
        createPublishDoc('user', {
            name: toField(data.name),
            email: toField(data.email),
            phoneNumber: toField(data.phoneNumber),
            pledgeTerm: toField(data.pledgeTerm),
            standing: toField(data.standing),
            uid: toField(userCredential.user.uid)
        })
        .then((entry) => {
            console.log('New user created');
        })
        .catch((error) => {
            console.error(error);
        })
    })
}

export async function createUserFirebase(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
}

export async function signInUser(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
}

export async function signOutUser() {
    return signOut(auth);
}

export const AuthContext = React.createContext({ user: undefined, userData: undefined });

export const useAuthContext = () => React.useContext(AuthContext);

export function AuthContextProvider({ children }) {
    const [user, setUser] = React.useState<User>(null);
    const [userData, setUserData] = React.useState<any>(null);
    const [loading, setLoading] = React.useState<boolean>(true);

    React.useEffect(() => {
        const setData = async (user: User) => {
            setUserData(await getProfile(await user.getIdToken()));
        }
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user ?? null);
            if (user)
                setData(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, userData }}>
            { loading ? <div>Loading...</div> : children }
        </AuthContext.Provider>
    )
}