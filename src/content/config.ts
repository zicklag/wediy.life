import { z, defineCollection } from 'astro:content';
import { marked } from 'marked';
import { getArticles } from '~/lib/directus';

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
    const data = await getArticles();

    return data.articles.map((x) => {
      const findEnglish = (t: { languages_id: { code: string } }) => t.languages_id.code.startsWith('en');
      const translation = x.translations.find(findEnglish)!;
      return {
        id: x.slug,
        title: translation.title,
        publishDate: new Date(x.published_date),
        content: marked(translation.body),
        tags: x.tags.map((tag) => tag.tags_id.slug),
        image: translation.feature_image?.id
          ? `https://directus.katharostech.com/assets/${translation.feature_image.id}`
          : undefined,
      };
    });
  },
  // loader: glob({ pattern: ['*.md', '*.mdx'], base: 'src/data/post' }),

  schema: z.object({
    publishDate: z.date().optional(),
    updateDate: z.date().optional(),
    draft: z.boolean().optional(),

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
