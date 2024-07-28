const fs = require('fs');

const defaultPage = 'https://en.wikipedia.org/wiki/Kubernetes';

const storePageToNginx = (path, html) => {
  const filePath = `/usr/share/nginx/html/${path}.html`;

  fs.writeFileSync(filePath, html, { flag: 'w+' });
};

(async () => {
  const defaultPageContentResponse = await fetch(defaultPage);

  const htmlContent = await defaultPageContentResponse.text()
  const url = new URL(defaultPageContentResponse.url);
  const path = url.pathname.split('/').at(-1);

  storePageToNginx(path, htmlContent);
})();
