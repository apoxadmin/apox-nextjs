'use server'

import { createClientServer } from "./server"

export async function getMyUser() {
    const supabase = createClientServer();

    const userAuth = await supabase.auth.getUser();
    if (userAuth.error || !userAuth.data?.user)
        console.error(userAuth.error);
    
    const userData = await supabase
    .from('users')
    .select('id, name, email, phoneNumber, pledgeTerm, major, linkedin, instagram, facebook, birthday, address, serviceHoursTotal, serviceHoursTerm, fundraising, violations, dues, flyering, tagline, roles ( name, shorthand, privileged ), standing')
    .eq('uid', userAuth.data.user.id)
    .maybeSingle();

    if (userData.error || !userData.data)
        console.error(userData.error);

    return userData.data;
}