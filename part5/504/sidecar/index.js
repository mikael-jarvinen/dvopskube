const fs = require('fs');

const storePageToNginx = (path, html) => {
  const filePath = `/usr/share/nginx/html/${path}.html`;

  fs.writeFileSync(filePath, html, { flag: 'w+' });
};

const loop = async () => {
  const randomPageContentResponse = await fetch('https://en.wikipedia.org/wiki/Special:Random');

  const htmlContent = await randomPageContentResponse.text()
  const url = new URL(randomPageContentResponse.url);
  const path = url.pathname.split('/').at(-1);

  storePageToNginx(path, htmlContent);


  // Random number between 5 and 15
  const delay = Math.floor(Math.random() * 11) + 5;

  setTimeout(loop, delay * 1000);
};

loop();
