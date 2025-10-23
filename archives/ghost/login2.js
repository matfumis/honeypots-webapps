module.exports = async function (context, commands) {
  const URL = 'http://ghost';  // o http://ghost.local
  await commands.measure.start(URL);
  await commands.measure.start(URL + '/about/');
  await commands.measure.start(URL + '/coming-soon/');
};
