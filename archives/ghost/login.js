export default async function (context, commands) {
  const Depth = 6;

  const URL = 'http://ghost.local/';
  const baseDomain = 'ghost.local';

  const visited = new Set();

  async function crawlAndMeasure(url, depth = 0, maxDepth = 2) {
    if (visited.has(url) || depth > maxDepth) return;
    visited.add(url);

    try {
      await commands.measure.start(url);
    } catch (error) {
      console.error(`Error occured while measuring ${url} : ${error.message}`);
      return; 
    }

    const links = await commands.js.run(`
      return Array.from(document.querySelectorAll('a'))
        .map(a => a.href)
        .filter(href => href.includes('${baseDomain}') && !href.includes('#'));
    `);

    for (const href of links) {
      if (!visited.has(href)) {
        await crawlAndMeasure(href, depth + 1, maxDepth);
      }
    }
  }

  await crawlAndMeasure(URL, 0, Depth);
}
