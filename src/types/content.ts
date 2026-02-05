export type ISODateString = string;
export type AuthorId = string;

export interface IHeroImage {
  readonly src: string;
  readonly alt: string;
  readonly width?: number;
  readonly height?: number;
}

/**
 * Blog post frontmatter contract for `src/pages/posts/*.md`.
 * Intended to support SEO meta + Schema.org BlogPosting in `PostLayout.astro`.
 */
export interface IBlogPostFrontmatter {
  readonly title: string;
  readonly description: string;

  /**
   * Author slug/id to link to `/authors/{author}`.
   * Example: `aelkus`, `vivienne-raper`
   */
  readonly author: AuthorId;

  /**
   * The canonical route slug (usually matches filename).
   * Example: `tarkin-doctrine-geopolitics`
   */
  readonly slug: string;

  /**
   * Dates for display + JSON-LD.
   * - `pubDate`: primary publication date for the migrated post page
   * - `updatedDate`: last meaningful content update
   * - `originalPubDate`: optional historical original (e.g., WordPress-era) date
   */
  readonly pubDate: ISODateString;
  readonly updatedDate?: ISODateString;
  readonly originalPubDate?: ISODateString;

  /**
   * SEO-oriented fields
   * - `keywords`: keep as array even if sourced from comma-delimited text
   * - `tags`: site taxonomy / browsing
   */
  readonly keywords?: readonly string[];
  readonly tags?: readonly string[];

  /**
   * Optional canonical override. If absent, canonical derives from `site` + route.
   */
  readonly canonicalUrl?: string;

  /**
   * Social/share image (also used for JSON-LD `image` if provided).
   */
  readonly heroImage?: IHeroImage;

  /**
   * Draft gating. Defaults to `false` at build time (implementation detail).
   */
  readonly draft?: boolean;
}

export interface IAuthorAvatar {
  readonly src: string;
  readonly alt: string;
}

export interface IAuthorLinks {
  readonly website?: string;
  readonly github?: string;
  readonly x?: string;
  readonly linkedin?: string;
  readonly mastodon?: string;
}

/**
 * Author frontmatter contract for `src/pages/authors/*.md`.
 * Keep it simple to avoid requiring runtime logic to render author pages.
 */
export interface IAuthorFrontmatter {
  /**
   * Author slug/id used in URL + cross-links from posts.
   * Example: `aelkus`
   */
  readonly slug: AuthorId;

  readonly name: string;
  readonly bio: string;

  readonly avatar?: IAuthorAvatar;
  readonly links?: IAuthorLinks;

  /**
   * Optional SEO/identity enrichment.
   */
  readonly role?: string;
  readonly location?: string;
}

