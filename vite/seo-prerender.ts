/**
 * Vite plugin: after the bundle is written, render one HTML file per route
 * and article plus sitemap.xml, robots.txt and rss.xml (src/seo/prerender.ts).
 *
 * The page data lives in TypeScript modules that use the `@/` alias, so they
 * are loaded through a short-lived Vite SSR server instead of plain Node.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createServer, type Plugin, type ResolvedConfig } from 'vite';

interface PrerenderModule {
  renderSite(input: { template: string; now: Date }): Array<{ file: string; content: string }>;
}

export function seoPrerender(): Plugin {
  let config: ResolvedConfig;
  return {
    name: 'emaskuy:seo-prerender',
    apply: 'build',
    configResolved(resolved) {
      config = resolved;
    },
    writeBundle: {
      order: 'post',
      sequential: true,
      async handler() {
        const outDir = path.resolve(config.root, config.build.outDir);
        const template = await readFile(path.join(outDir, 'index.html'), 'utf8');
        const server = await createServer({
          root: config.root,
          configFile: false,
          logLevel: 'error',
          appType: 'custom',
          resolve: { alias: config.resolve.alias },
          server: { middlewareMode: true, hmr: false, ws: false },
        });
        try {
          const mod = (await server.ssrLoadModule('/src/seo/prerender.ts')) as PrerenderModule;
          const files = mod.renderSite({ template, now: new Date() });
          for (const f of files) {
            const target = path.join(outDir, f.file);
            await mkdir(path.dirname(target), { recursive: true });
            await writeFile(target, f.content);
          }
          config.logger.info(`seo-prerender: ${files.length} files`);
        } finally {
          await server.close();
        }
      },
    },
  };
}
