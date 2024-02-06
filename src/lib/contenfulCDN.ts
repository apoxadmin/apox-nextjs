'use server'

import { cdnClient } from '@/lib/contentfulCDNClient';
import { headers } from 'next/headers'
import { verifyToken } from '@/lib/firebaseAdmin';

async function getDocs(query: any) {
    const entries = await cdnClient.getEntries(query);
    return entries.items;
}

export async function getProfile(accessToken: string) {
    const uid = (await verifyToken(accessToken)).uid
    const userEntry = (await getDocs({ content_type: 'user', 'fields.uid': uid }))[0];
    const userData = userEntry.fields;
    delete userData.uid;
    userData['id'] = userEntry.sys.id;
    return userData;
}

export async function getCDNUsers(accessToken, query) {
    verifyToken(accessToken)
    .then((decoded) => {
        console.log(decoded);
    })
}

export async function getEvents(query: any) {
    return getDocs({
        content_type: 'event',
        ...query
    });
}