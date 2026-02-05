/**
 * Astro + Cloudflare Pages Draft Spec (NO implementation logic)
 * Repo: /Volumes/SSD/dev/blogtakin
 *
 * Scope:
 * 1) Astro init with `@astrojs/cloudflare` + `@astrojs/sitemap`
 * 2) Migrate 4 optimized articles -> `src/pages/posts/` with proper frontmatter
 * 3) Layouts: `BaseLayout.astro`, `PostLayout.astro` (Schema.org BlogPosting) + SEO component
 * 4) Author pages: `aelkus`, `vivienne-raper`
 * 5) `public/_redirects` with 6 redirects from `old content/redirection_plan.md`
 * 6) `astro.config.mjs` configured for Cloudflare Pages deployment
 *
 * Standards note:
 * - Interfaces use `I` prefix (per `/Volumes/SSD/skills/_shared/code-standards.json`)
 * - Single quotes, semicolons, max line ~100
 */

/* -------------------------------------------------------------------------------------------------
 * 1) Directory structure (ASCII tree)
 * ------------------------------------------------------------------------------------------------- */

export const PROJECT_STRUCTURE_TREE = `
blogtakin/
  package.json
  astro.config.mjs
  tsconfig.json
  public/
    _redirects
  src/
    components/
      Seo.astro
    layouts/
      BaseLayout.astro
      PostLayout.astro
    pages/
      index.astro
      posts/
        tarkin-doctrine-geopolitics.md
        modern-drone-glossary.md
        scifi-geopolitics-sandbox.md
        padawan-analysis-star-wars.md
      authors/
        aelkus.md
        vivienne-raper.md
    types/
      content.ts
  docs/
  old content/
    optimized_tarkin_doctrine.md
    optimized_drone_glossary.md
    optimized_scifi_geopolitics.md
    optimized_padawan_analysis.md
    redirection_plan.md
`.trim();

/**
 * Project structure plan (high-level, no code):
 * - Initialize Astro project; add `@astrojs/cloudflare` + `@astrojs/sitemap`
 * - Create layouts + SEO component (head/meta + JSON-LD emission)
 * - Add post markdown pages under `src/pages/posts/` with typed frontmatter
 * - Add author markdown pages under `src/pages/authors/` with typed frontmatter
 * - Add `public/_redirects` (Cloudflare Pages) using CRITICAL_REDIRECTS below
 * - Configure `astro.config.mjs` per `IAstroConfigSchema` below
 */
export const PROJECT_STRUCTURE_PLAN: readonly string[] = [
  'Initialize Astro (Cloudflare adapter + sitemap)',
  'Add layouts and SEO component shells',
  'Migrate 4 optimized posts with frontmatter',
  'Create 2 author pages with frontmatter',
  'Add public/_redirects (6 lines)',
  'Set astro.config.mjs for Pages',
] as const;

export interface IPlannedContentMigration {
  readonly sourcePath: string;
  readonly targetPath: string;
  readonly slug: string;
}

export const PLANNED_POST_MIGRATIONS: readonly IPlannedContentMigration[] = [
  {
    sourcePath: 'old content/optimized_tarkin_doctrine.md',
    targetPath: 'src/pages/posts/tarkin-doctrine-geopolitics.md',
    slug: 'tarkin-doctrine-geopolitics',
  },
  {
    sourcePath: 'old content/optimized_drone_glossary.md',
    targetPath: 'src/pages/posts/modern-drone-glossary.md',
    slug: 'modern-drone-glossary',
  },
  {
    sourcePath: 'old content/optimized_scifi_geopolitics.md',
    targetPath: 'src/pages/posts/scifi-geopolitics-sandbox.md',
    slug: 'scifi-geopolitics-sandbox',
  },
  {
    sourcePath: 'old content/optimized_padawan_analysis.md',
    targetPath: 'src/pages/posts/padawan-analysis-star-wars.md',
    slug: 'padawan-analysis-star-wars',
  },
] as const;

/* -------------------------------------------------------------------------------------------------
 * 2) TypeScript interface for blog post frontmatter
 * ------------------------------------------------------------------------------------------------- */

export type ISODateString = string;
/**
 * ISODateString expectations:
 * - Prefer full ISO 8601 timestamps: `2026-02-03T00:00:00Z`
 * - Accept date-only when needed: `2026-02-03`
 */

export type AuthorId = string;

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

export interface IHeroImage {
  readonly src: string;
  readonly alt: string;
  readonly width?: number;
  readonly height?: number;
}

/* -------------------------------------------------------------------------------------------------
 * 3) TypeScript interface for author frontmatter
 * ------------------------------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------------------------------
 * 4) Configuration schema for astro.config.mjs (Cloudflare Pages deployment)
 * ------------------------------------------------------------------------------------------------- */

export type AstroOutputMode = 'static' | 'server' | 'hybrid';
export type AstroBuildFormat = 'directory' | 'file';
export type AstroInlineStylesheets = 'auto' | 'always' | 'never';

export interface IAstroConfigSchema {
  /**
   * Required for absolute canonicals + sitemap.
   * Example: `https://blogtarkin.com`
   */
  readonly site: string;

  /**
   * For Cloudflare adapter deployments, `server` or `hybrid` is typical.
   */
  readonly output: AstroOutputMode;

  /**
   * Cloudflare adapter config (intended for `@astrojs/cloudflare`).
   */
  readonly adapter: ICloudflareAdapterSchema;

  /**
   * Integrations should include `@astrojs/sitemap`.
   */
  readonly integrations: readonly IAstroIntegrationSchema[];

  readonly build?: IAstroBuildSchema;
  readonly markdown?: IAstroMarkdownSchema;

  /**
   * Keep Vite config typed but open-ended for performance tuning.
   */
  readonly vite?: Record<string, unknown>;
}

export interface ICloudflareAdapterSchema {
  /**
   * `mode` is adapter-specific; commonly used values:
   * - `directory` (Cloudflare Pages)
   * - `advanced` (Workers-style/advanced routing)
   */
  readonly package: '@astrojs/cloudflare';
  readonly mode?: 'directory' | 'advanced';

  /**
   * Adapter-specific route strategy (kept open-ended in draft).
   */
  readonly routes?: {
    readonly strategy?: 'auto' | 'include' | 'exclude' | string;
  };

  /**
   * Escape hatch for adapter options that may vary by adapter version.
   */
  readonly options?: Record<string, unknown>;
}

export interface IAstroIntegrationSchema {
  /**
   * Example: `@astrojs/sitemap`
   */
  readonly package: string;

  /**
   * Integration options are version-dependent; keep as a schema placeholder.
   */
  readonly options?: Record<string, unknown>;
}

export interface IAstroBuildSchema {
  readonly format?: AstroBuildFormat;
  readonly inlineStylesheets?: AstroInlineStylesheets;
}

export interface IAstroMarkdownSchema {
  readonly syntaxHighlight?: 'shiki' | 'prism' | 'none';
  readonly shikiConfig?: {
    readonly theme?: string;
    readonly wrap?: boolean;
  };
}

/* -------------------------------------------------------------------------------------------------
 * 5) Redirect mapping type definitions (Cloudflare Pages `_redirects`)
 * ------------------------------------------------------------------------------------------------- */

export type RedirectStatusCode = 301 | 302 | 307 | 308;

export interface IRedirectRule {
  readonly fromPath: string;
  readonly toPath: string;
  readonly status: RedirectStatusCode;

  /**
   * Optional note (SEO rationale, source, etc.)
   */
  readonly note?: string;
}

/**
 * Cloudflare Pages `_redirects` line format (draft):
 * `{fromPath} {toPath} {status}`
 */
export type RedirectsFileLine = string;

export interface IRedirectsFileSchema {
  readonly headerComment?: string;
  readonly rules: readonly IRedirectRule[];

  /**
   * Optional catch-alls (kept separate to avoid accidental broad redirects).
   */
  readonly catchAllRules?: readonly IRedirectRule[];
}

/**
 * 6 redirects copied from `old content/redirection_plan.md` (Option A block).
 * Note: One uses a wildcard suffix `*` in the from-path.
 */
export const CRITICAL_REDIRECTS: readonly IRedirectRule[] = [
  {
    fromPath: '/2012/08/06/the-tarkin-doctrine-and-the-sith-way-of-war/',
    toPath: '/posts/tarkin-doctrine-geopolitics',
    status: 301,
  },
  {
    fromPath: '/drone-definitions-learning-the-drone-lingo/',
    toPath: '/posts/modern-drone-glossary',
    status: 301,
  },
  {
    fromPath: '/2012/11/12/star-wars-the-dark-side-of-victory*',
    toPath: '/posts/scifi-geopolitics-sandbox',
    status: 301,
  },
  {
    fromPath: '/2012/11/25/a-padawans-analysis-of-star-wars-episode-iv-a-new-hope/',
    toPath: '/posts/padawan-analysis-star-wars',
    status: 301,
  },
  {
    fromPath: '/author/aelkus/',
    toPath: '/authors/aelkus',
    status: 301,
  },
  {
    fromPath: '/author/vivienne-raper/',
    toPath: '/authors/vivienne-raper',
    status: 301,
  },
] as const;
