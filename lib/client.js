import sanityClient from '@sanity/client';
import imageBuilder from '@sanity/image-url'

export const client = sanityClient({
    projectId: 'coxrim0o',
    dataset: 'production',
    apiVersion: '2022-10-05',
    useCdn: true
})

const builder = imageBuilder(client)

export const urlFor = (source)=>builder.image(source);