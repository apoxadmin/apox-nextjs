'use server'

import { cookies } from 'next/headers'
import { cmaClient } from '@/lib/contentfulCMAClient';
import { Entry } from 'contentful-management';

async function getDB() {
    return (await cmaClient.getSpace(process.env.CONTENTFUL_SPACE_ID)).getEnvironment('master');
}

async function getCMADocs(query: Object) {
    const entries = await (await getDB()).getEntries(query);
    return entries.items;
}

export async function updateDoc(query: Object, fields: Object) {
    const entry = (await getCMADocs(query))?.at(0);
    for (const field in fields) {
        entry.fields[field] = fields[field];
    }
    (await entry.update()).publish();
}

export async function createDoc(contentType: string, fields: Object) {
    (await getDB()).createEntry(contentType, { fields: fields });
}

export async function createPublishDoc(contentType: string, fields: Object) {
    (await (await getDB()).createEntry(contentType, { fields: fields })).publish();
}