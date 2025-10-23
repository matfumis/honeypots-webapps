export default async function (context, commands) {
  const username = 'admin@admin.com';
  const password = '12345@Admin';
  const usernameField = '1';
  const passwordField = '2'

  const loginURL = 'http://metabase.local/auth/login';
  const URL = 'http://metabase.local/';
  const buttonID = 'loginbtn';
  const baseDomain = 'metabase.local';
  const Depth = 3;



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



/*
  // Login
  await commands.navigate(loginURL);
  await commands.addText.byId(username, usernameField);
  await commands.addText.byId(password, passwordField);
  // await commands.click.byIdAndWait(buttonID);
  await commands.click.bySelector('button[type="submit"]');
  

  // await commands.wait.bySelector('.usermenu');

*/

  await commands.navigate(loginURL);
  await commands.wait.bySelector('input[name="username"]');
  await commands.addText.bySelector(username, 'input[name="username"]');
  await commands.addText.bySelector(password, 'input[name="password"]');
  // await commands.click.bySelector('input[name="remember"]');  
  await commands.click.bySelector('button[type="submit"]');
  // await commands.wait.byTime(2000); // attesa post-login
  
  // Start crawl
  await crawlAndMeasure(URL, 0, Depth);
}
