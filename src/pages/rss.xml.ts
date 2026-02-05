import rss from '@astrojs/rss';
import type { APIContext } from 'astro';

const posts = [
  {
    slug: 'dune-geopolitics-arrakis',
    title: 'The Geopolitics of Arrakis: Resource Control and Imperialism in Dune',
    description: 'How Frank Herbert\'s Dune mirrors real-world resource wars, imperial competition, and indigenous resistance.',
    pubDate: '2026-02-03T00:00:00Z',
  },
  {
    slug: 'ai-overlords-always-fail',
    title: 'The Human Element: Why AI Overlords Always Fail in Science Fiction',
    description: 'From HAL 9000 to Skynet, analyzing the AI alignment problem and human unpredictability.',
    pubDate: '2026-02-03T00:00:00Z',
  },
  {
    slug: 'swarm-warfare-enders-game',
    title: 'Swarm Tactics and Decentralized Warfare: From Ender\'s Game to Modern Drone Swarms',
    description: 'How Ender\'s Game predicted modern warfare through swarm tactics and decentralized command.',
    pubDate: '2026-02-03T00:00:00Z',
  },
  {
    slug: 'tarkin-doctrine-geopolitics',
    title: 'The Tarkin Doctrine: Geopolitical Lessons from the Sith Way of War',
    description: 'Deterrence, asymmetric warfare, and the psychology of power — updated for 2026.',
    pubDate: '2026-02-03T00:00:00Z',
  },
  {
    slug: 'modern-drone-glossary',
    title: 'The Modern Guide to Drone & Autonomous Systems: Beyond the Lingo',
    description: 'An updated glossary covering FPV, BVLOS, swarms, edge AI, and loitering munitions.',
    pubDate: '2026-02-03T00:00:00Z',
  },
  {
    slug: 'scifi-geopolitics-sandbox',
    title: 'Sci-Fi as a Sandbox for Geopolitics: From Tarkin to The Expanse',
    description: 'How sci-fi explores resource scarcity, conflict, deterrence, and autonomous sovereignty.',
    pubDate: '2026-02-03T00:00:00Z',
  },
  {
    slug: 'padawan-analysis-star-wars',
    title: 'A Padawan\'s Analysis: Star Wars Through the Eyes of the Next Generation',
    description: 'A modernized analysis of Episode IV through the unfiltered reactions of two kids.',
    pubDate: '2026-02-03T00:00:00Z',
  },
];

export async function GET(context: APIContext) {
  return rss({
    title: 'Grand Blog Tarkin',
    description: 'Where geopolitics meets science fiction. Deep analysis of power, strategy, and technology.',
    site: context.site || 'https://blogtarkin.com',
    items: posts.map((post) => ({
      title: post.title,
      description: post.description,
      pubDate: new Date(post.pubDate),
      link: `/posts/${post.slug}/`,
    })),
    customData: '<language>en-us</language>',
  });
}
