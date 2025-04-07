import { createDirectus, graphql } from '@directus/sdk';

type Article = {
  id: string;
  title: string;
  body: string;
  slug: string;
  EventDate: string;
  date_created: string;
  date_updated: string;
  project_id: {
    title: string;
  };
  excerpt?: string;
  feature_image: string;
};

type Schema = {
  articles: Article[];
};

type GalleryItem = {
  id: string;
  project_id: { title: string };
  media_type: string;
  source_url: string;
  item_name: string;
};

const directus = createDirectus<Schema>('https://directus.wediy.life').with(graphql());

export default directus;

export async function getArticles() {
  const { wediylife_posts } = await directus.query<{ wediylife_posts: Article[] }>(
    `
    query {
	wediylife_posts {
    id
    slug
    EventDate
    date_created
    date_updated
    excerpt
    project_id {
      title
    }
    title
    body
    feature_image
  }
}`
  );
  return wediylife_posts;
}

export async function getGallery() {
  const { wediylife_gallery } = await directus.query<{ wediylife_gallery: GalleryItem[] }>(
    `
    query {
	wediylife_gallery {
    id
    project_id {
      title
    }
    media_type 
    source_url 
    item_name
  }
}`
  );
  return wediylife_gallery;
}
