export default async function (context, commands) {
  const username = 'admin';
  const password = 'admin';
  const usernameField = 'j_username';
  const passwordField = 'j_password';

  const loginURL = 'http://jenkins.local/login';
  const startPage = 'http://jenkins.local/'; // la tua pagina che funziona
  const baseDomain = 'jenkins.local';
  const Depth = 2;

  const visited = new Set();

  // attende che il conteggio delle risorse non cambi per "stableMs" millisecondi (max timeout)
  async function waitForNetworkIdle(maxTimeout = 15000, stableMs = 1500) {
    const interval = 500;
    let lastCount = Number(await commands.js.run('return performance.getEntriesByType("resource").length || 0;'));
    let stableStart = Date.now();
    const deadline = Date.now() + maxTimeout;

    while (Date.now() < deadline) {
      await commands.wait.byTime(interval);
      let count = Number(await commands.js.run('return performance.getEntriesByType("resource").length || 0;'));
      if (count === lastCount) {
        if (Date.now() - stableStart >= stableMs) {
          // consideriamo la rete "idle"
          return;
        }
      } else {
        // risorse cambiate, reset timer
        lastCount = count;
        stableStart = Date.now();
      }
    }
    // timeout raggiunto — esci comunque
  }

  async function crawlAndMeasure(url, depth = 0, maxDepth = 2) {
    if (visited.has(url) || depth > maxDepth) return;
    visited.add(url);

    try {
      // naviga e aspetta che il contenuto principale ci sia
      await commands.navigate(url);
      // selettore stabile in Jenkins; se non c'è fallback a wait.byTime
      await commands.wait.bySelector('#main-panel', 8000).catch(() => commands.wait.byTime(2000));
      // aspetta che le risorse si stabilizzino
      await waitForNetworkIdle(15000, 1500);

      // ora misuriamo la pagina (Sitespeed/Browsertime)
      await commands.measure.start(url);
    } catch (error) {
      console.error(`Error occured while measuring ${url} : ${error.message}`);
      return;
    }

    // raccogli link interni utili (escludo logout, anchor e plugin esterni)
    const links = await commands.js.run(`
      return Array.from(document.querySelectorAll('a'))
        .map(a => a.href)
        .filter(href => href && href.includes('${baseDomain}') && !href.includes('#') && !href.toLowerCase().includes('logout') && !href.toLowerCase().includes('logout'));
    `);

    for (const href of links) {
      if (!visited.has(href)) {
        await crawlAndMeasure(href, depth + 1, maxDepth);
      }
    }
  }

  // Login (uguale al tuo originale)
  await commands.navigate(loginURL);
  await commands.addText.byId(username, usernameField);
  await commands.addText.byId(password, passwordField);
  await commands.click.bySelector('button[type="submit"]');

  // aspetta che il login completi e che la pagina post-login sia pronta
  await commands.navigate(startPage);
  await commands.wait.bySelector('#main-panel', 8000).catch(() => commands.wait.byTime(2000));
  await waitForNetworkIdle(15000, 1500);

  // Start crawl dalla pagina stabile
  await crawlAndMeasure(startPage, 0, Depth);
}
