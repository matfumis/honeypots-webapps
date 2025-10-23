export default async function (context, commands) {
  const username = 'Admin';
  const password = 'zabbix';
  const usernameField = 'name';
  const passwordField = 'password'

  const loginURL = 'http://zabbix.local/index.php';
  const URL = 'http://zabbix.local/zabbix.php?action=dashboard.list';
  const buttonID = 'enter';
  const baseDomain = 'zabbix.local';
  const Depth = 2;



  const visited = new Set();


  async function crawlAndMeasure(url, depth = 0, maxDepth = 3) {
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
  await commands.addText.byId(username, usernameField);
  await commands.addText.byId(password, passwordField);
  await commands.click.byIdAndWait(buttonID);
  // await commands.click.bySelector('button[type="submit"]');

 // await commands.wait.bySelector('.user-menu');

  // Start crawl
  await crawlAndMeasure(URL, 0, Depth);
}
