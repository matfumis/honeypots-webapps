
export default async function (context, commands) {
  const username = 'admin';
  const password = 'admin';
  const usernameField = 'user';
  const passwordField = 'password'

  const loginURL = 'http://grafana.local/login';
  const URL = 'http://grafana.local/dashboards';
  //buttonID = 'button_ID';
  const baseDomain = 'grafana.local';
  const Depth = 3;



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


  // Login
  await commands.navigate(loginURL);
  await commands.addText.byName(username, usernameField);
  await commands.addText.byName(password, passwordField);
  //await commands.click.byIdAndWait(buttonID);
  await commands.click.bySelector('button[aria-label="Login button"]');

  // await commands.wait.byTime(1000);

  //await commands.addText.byName(password, 'newPassword');
  //await commands.addText.byName(password, 'confirmNew');

  //await commands.click.bySelector('button[type="submit"]');

  // Start crawl
  await crawlAndMeasure(URL, 0, Depth);
}
