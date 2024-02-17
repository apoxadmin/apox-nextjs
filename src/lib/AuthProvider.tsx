'use client'

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React, { useEffect } from "react";

const initial = { session: null, user: null, userData: null };
export const AuthContext = React.createContext(initial);

export function AuthProvider({ children }) {
    const supabase = createClientComponentClient();
    const [state, setState] = React.useState(initial);

    useEffect(() => {
        const { data: listener } = supabase.auth.onAuthStateChange(async ( event, session) => {
            let userData = null;
            if (session?.user) {
                userData = (await supabase
                    .from('users')
                    .select('id, name, email, phoneNumber, pledgeTerm, major, linkedin, instagram, facebook, birthday, address, serviceHoursTotal, serviceHoursTerm, fundraising, violations, dues, flyering, tagline, roles ( name, shorthand, privileged ), standing')
                    .eq('uid', session?.user.id)
                    .maybeSingle())
                    .data;
            }
            setState({ session: session, user: session?.user ?? null, userData });
        });

        async function getAuth() {
            const session = (await supabase.auth.getSession()).data.session;
            let userData = null;
            if (session?.user) {
                userData = (await supabase
                    .from('users')
                    .select('id, name, email, phoneNumber, pledgeTerm, major, linkedin, instagram, facebook, birthday, address, serviceHoursTotal, serviceHoursTerm, fundraising, violations, dues, flyering, tagline, roles ( name, shorthand, privileged ), standing')
                    .eq('uid', session?.user.id)
                    .maybeSingle())
                    .data;
            }
            setState({ session, user: session?.user ?? null, userData });
        }

        getAuth();

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    return React.useContext(AuthContext);
}