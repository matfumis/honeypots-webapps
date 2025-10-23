// login.js — Browsertime/Sitespeed (CommonJS), visita pagine selezionate
module.exports = async function (context, commands) {
  // === CONFIG ===
  const BASE = new URL('http://metabase:3000'); // include la porta!
  const origin = BASE.origin;                   // "http://metabase:3000"

  const username = 'admin@admin.com';
  const password = '12345@Admin';

  const loginURL = new URL('/auth/login', BASE).href;

  // Pagine da visitare (solo path locali; verranno risolti contro BASE)
  const paths = [
    '/',                         // home
    '/browse',                   // esplora
    '/collection/root',          // raccolte
    '/admin/databases/create',   // pagina admin
    '/auto/dashboard/table/1',   // qualche dashboard di esempio
    '/auto/dashboard/table/2'
  ];

  // Utility per creare URL assoluti e garantire same-origin (con porta)
  const abs = (p) => new URL(p, BASE).href;

  // Piccola util per scrollare e far partire lazy-load
  async function nudgePage() {
    await commands.js.run(`
      (function(){
        try {
          window.scrollTo(0, document.body.scrollHeight);
          setTimeout(()=>window.scrollTo(0, 0), 200);
        } catch(e) {}
      })();
    `);
  }

  // === LOGIN ===
  await commands.navigate(loginURL);
  await commands.wait.bySelector('input[name="username"]');
  await commands.addText.bySelector(username, 'input[name="username"]');
  await commands.addText.bySelector(password, 'input[name="password"]');
  await commands.click.bySelector('button[type="submit"]');
  // attesa post-login per far stabilizzare la sessione/API
  await commands.wait.byTime(2000);

  // === VISITA PAGINE SELEZIONATE ===
  for (const p of paths) {
    const url = abs(p);

    // garanzia same-origin (schema+host+porta)
    if (new URL(url).origin !== origin) continue;

    await commands.measure.start(url);
    await commands.wait.byTime(1500); // lascia terminare XHR/render
    await nudgePage();
    await commands.wait.byTime(600);
  }
};
