
export default async function (context, commands) {
  const username = 'root';
  const password = '12345@Admin';
  const usernameField = 'user_login';
  const passwordField = 'user_password'

  const loginURL = 'http://gitlab.local/users/sign_in';
  const URL = 'http://gitlab.local/';
  //buttonID = 'button_ID';
  const baseDomain = 'gitlab.local';
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
  await commands.addText.byId(username, usernameField);
  await commands.addText.byId(password, passwordField);
  //await commands.click.byIdAndWait(buttonID);
  await commands.click.bySelector('button[type="submit"]');

  // Start crawl
  await crawlAndMeasure(URL, 0, Depth);
}
