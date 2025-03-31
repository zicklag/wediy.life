import { z, defineCollection } from 'astro:content';
import { marked } from 'marked';
import { getArticles } from '..//lib/directus.ts';

const metadataDefinition = () =>
  z
    .object({
      title: z.string().optional(),
      ignoreTitleTemplate: z.boolean().optional(),

      canonical: z.string().url().optional(),

      robots: z
        .object({
          index: z.boolean().optional(),
          follow: z.boolean().optional(),
        })
        .optional(),

      description: z.string().optional(),

      openGraph: z
        .object({
          url: z.string().optional(),
          siteName: z.string().optional(),
          images: z
            .array(
              z.object({
                url: z.string(),
                width: z.number().optional(),
                height: z.number().optional(),
              })
            )
            .optional(),
          locale: z.string().optional(),
          type: z.string().optional(),
        })
        .optional(),

      twitter: z
        .object({
          handle: z.string().optional(),
          site: z.string().optional(),
          cardType: z.string().optional(),
        })
        .optional(),
    })
    .optional();

const postCollection = defineCollection({
  loader: async () => {
    const articles = await getArticles();
    return articles.map((x) => {
      return {
        id: x.slug,
        EventDate: new Date(x.EventDate),
        title: x.title,
        excerpt: x.excerpt,
        category: x.project_id.title,
        slug: x.slug,
        publishDate: new Date(x.date_updated),
        content: marked(x.body),
        tags: [],
        image: x.feature_image ? `https://directus.wediy.life/assets/${x.feature_image}` : undefined,
      };
    });
  },
  // loader: glob({ pattern: ['*.md', '*.mdx'], base: 'src/data/post' }),

  schema: z.object({
    publishDate: z.date().optional(),
    updateDate: z.date().optional(),
    draft: z.boolean().optional(),

    EventDate: z.date().optional(),
    title: z.string(),
    excerpt: z.string().optional(),
    image: z.string().optional(),

    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),
    content: z.string(),

    metadata: metadataDefinition(),
  }),
});

export const collections = {
  post: postCollection,
};
