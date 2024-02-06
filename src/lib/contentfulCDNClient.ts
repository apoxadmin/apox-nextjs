import * as contentfulCDN from "contentful"

if (!process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_CDN_TOKEN) {
    throw new ReferenceError('No Contentful CMA API Environmental Variables set. Please set them as `SPACE_ID`, `CDN_TOKEN` in /.env.local');
}

export const cdnClient = contentfulCDN.createClient({
    accessToken: process.env.CONTENTFUL_CDN_TOKEN,
    space: process.env.CONTENTFUL_SPACE_ID
});