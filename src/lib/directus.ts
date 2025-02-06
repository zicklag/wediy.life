import { createDirectus, graphql } from '@directus/sdk';

type Author = {
  directus_users_id: {
    display_name: string;
    slug: string;
  };
};

type ArticleTranslation = {
  title: string;
  body: string;
  feature_image: {
    id: string;
  };
  languages_id: {
    code: string,
  }
};

type Tag = {
  id: string;
  tags_id: {
    slug: string;
    translations: {
      title: string;
      languages_code: {
        code: string;
      };
    }[];
  };
};

type Article = {
  id: string;
  slug: string;
  published_date: string;
  authors: Author[];
  tags: Tag[];
  translations: ArticleTranslation[];
};

type Schema = {
  articles: Article[];
};

const directus = createDirectus<Schema>('https://directus.katharostech.com').with(graphql());

export default directus;

export async function getArticles() {
  return await directus.query<{ articles: Article[] }>(`
    query {
  articles {
    id
    slug
    published_date
    authors {
    	directus_users_id {
        display_name
        slug
      }
    }
    tags {
      id
      tags_id {
        slug
        translations {
          title
          languages_code {
            code
          }
        }
      }
    }
    translations {
      title
      body 
      feature_image {
        id
      }
      languages_id {
        code
      }
    }
  }
}   
  `);
}
