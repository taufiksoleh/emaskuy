/**
 * Vite plugin: serve/copy src/content/*.json at a stable, unhashed
 * /content/*.json URL, so the client can refetch them at runtime (see
 * src/lib/antam.ts and src/lib/aiInsight.ts) without that URL changing on
 * every content update the way a hashed asset import would — the whole
 * point is that a visitor's cached app shell can pick up today's content
 * without needing a new JS bundle.
 *
 * The content agent still writes the very same src/content/*.json files
 * (docs/content-pipeline.md); this only adds a second, unhashed copy of
 * them to the served output. In dev it serves them straight from disk.
 */
import { copyFile, mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Plugin, ResolvedConfig } from 'vite';

const FILES = ['antam.json', 'ai-insight.json'];

export function copyContentJson(): Plugin {
  let config: ResolvedConfig;
  return {
    name: 'emaskuy:copy-content-json',
    configResolved(resolved) {
      config = resolved;
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const name = FILES.find((f) => req.url === `/content/${f}`);
        if (!name) {
          next();
          return;
        }
        try {
          const body = await readFile(path.join(config.root, 'src/content', name), 'utf8');
          res.setHeader('Content-Type', 'application/json');
          res.end(body);
        } catch {
          next();
        }
      });
    },
    async writeBundle() {
      const targetDir = path.join(path.resolve(config.root, config.build.outDir), 'content');
      await mkdir(targetDir, { recursive: true });
      for (const name of FILES) {
        await copyFile(path.join(config.root, 'src/content', name), path.join(targetDir, name));
      }
    },
  };
}
