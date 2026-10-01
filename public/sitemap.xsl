<?xml version="1.0" encoding="UTF-8"?>
<!--
  Renders sitemap.xml as a readable table when a person opens it in a
  browser. Search engines ignore this file and read the XML directly.
-->
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  exclude-result-prefixes="s xhtml">
  <xsl:output method="html" encoding="UTF-8" indent="yes" doctype-system="about:legacy-compat" />

  <xsl:template match="/">
    <html lang="id">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
        <title>Sitemap · EmasKuy</title>
        <style>
          :root {
            --bg-0: #0a0b0e; --bg-1: #101218; --bg-2: #161922; --border: #262a35;
            --gold: #f5b93e; --text-1: #f2f4f8; --text-2: #9aa3b2; --text-3: #808a9b;
            color-scheme: dark;
          }
          @media (prefers-color-scheme: light) {
            :root {
              --bg-0: #fafaf7; --bg-1: #ffffff; --bg-2: #f4f2ec; --border: #e3dfd3;
              --gold: #875c06; --text-1: #171a21; --text-2: #4a5261; --text-3: #5f6776;
              color-scheme: light;
            }
          }
          * { box-sizing: border-box; }
          body {
            margin: 0; background: var(--bg-0); color: var(--text-1);
            font: 15px/1.5 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
          }
          main { max-width: 1040px; margin: 0 auto; padding: 40px 16px 64px; }
          header { margin-bottom: 24px; }
          .brand { color: var(--gold); font-weight: 700; letter-spacing: 0.02em; text-decoration: none; }
          h1 { margin: 8px 0 8px; font-size: 28px; line-height: 1.2; }
          p { margin: 0 0 6px; color: var(--text-2); max-width: 68ch; }
          p.en { color: var(--text-3); font-size: 14px; }
          .count {
            display: inline-block; margin-top: 12px; padding: 4px 10px; border-radius: 999px;
            border: 1px solid var(--border); background: var(--bg-2); color: var(--gold);
            font-size: 13px; font-weight: 600;
          }
          .table-wrap {
            overflow-x: auto; border: 1px solid var(--border); border-radius: 12px; background: var(--bg-1);
          }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 10px 14px; text-align: left; vertical-align: top; }
          th {
            position: sticky; top: 0; background: var(--bg-2); color: var(--text-3);
            font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em;
            border-bottom: 1px solid var(--border);
          }
          tr + tr td { border-top: 1px solid var(--border); }
          td.num { color: var(--text-3); font-variant-numeric: tabular-nums; width: 1%; }
          td.url a { color: var(--text-1); text-decoration: none; overflow-wrap: anywhere; }
          td.url a:hover { color: var(--gold); text-decoration: underline; }
          td.date { color: var(--text-2); font-variant-numeric: tabular-nums; white-space: nowrap; }
          .lang {
            display: inline-block; min-width: 30px; padding: 1px 6px; border-radius: 6px; text-align: center;
            border: 1px solid var(--border); color: var(--text-2); font-size: 12px; font-weight: 600;
          }
          .alt { color: var(--text-3); font-size: 13px; text-decoration: none; }
          .alt:hover { color: var(--gold); }
          .none { color: var(--text-3); }
          @media (max-width: 640px) {
            h1 { font-size: 22px; }
            th, td { padding: 8px 10px; }
            .hide-sm, .host { display: none; }
            td.url, td.date { font-size: 13px; }
          }
        </style>
      </head>
      <body>
        <main>
          <header>
            <a class="brand" href="/">EmasKuy</a>
            <h1>Sitemap</h1>
            <p>Daftar semua halaman EmasKuy untuk mesin pencari. Klik URL untuk membuka halamannya.</p>
            <p class="en">Every EmasKuy page, listed for search engines. Click a URL to open the page.</p>
            <span class="count"><xsl:value-of select="count(s:urlset/s:url)" /> URL</span>
          </header>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>URL</th>
                  <th class="hide-sm">Bahasa</th>
                  <th class="hide-sm">Versi lain</th>
                  <th>Diperbarui</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="s:urlset/s:url">
                  <xsl:variable name="loc" select="s:loc" />
                  <xsl:variable name="lang" select="xhtml:link[@href = $loc and @hreflang != 'x-default']/@hreflang" />
                  <xsl:variable name="other" select="xhtml:link[@href != $loc and @hreflang != 'x-default'][1]" />
                  <tr>
                    <td class="num"><xsl:value-of select="position()" /></td>
                    <td class="url">
                      <xsl:variable name="rest" select="substring-after($loc, '://')" />
                      <xsl:variable name="host" select="substring-before($rest, '/')" />
                      <a href="{$loc}"><span class="host"><xsl:value-of select="substring-before($loc, $rest)" /><xsl:value-of select="$host" /></span><xsl:value-of select="substring-after($rest, $host)" /></a>
                    </td>
                    <td class="hide-sm"><span class="lang"><xsl:value-of select="translate($lang, 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')" /></span></td>
                    <td class="hide-sm">
                      <xsl:choose>
                        <xsl:when test="$other">
                          <a class="alt" href="{$other/@href}" hreflang="{$other/@hreflang}">
                            <xsl:value-of select="translate($other/@hreflang, 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')" />
                          </a>
                        </xsl:when>
                        <xsl:otherwise><span class="none">—</span></xsl:otherwise>
                      </xsl:choose>
                    </td>
                    <td class="date">
                      <xsl:choose>
                        <xsl:when test="s:lastmod"><xsl:value-of select="s:lastmod" /></xsl:when>
                        <xsl:otherwise><span class="none">—</span></xsl:otherwise>
                      </xsl:choose>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
