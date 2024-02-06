import * as contentfulCMA from "contentful-management"

if (!process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_CMA_TOKEN) {
    throw new ReferenceError('No Contentful CMA API Environmental Variables set. Please set them as `SPACE_ID`, `CMA_TOKEN` in /.env.local');
}

export const cmaClient = contentfulCMA.createClient({
    accessToken: process.env.CONTENTFUL_CMA_TOKEN
});