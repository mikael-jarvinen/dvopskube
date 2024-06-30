const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    const randomArticleRequest = await fetch('https://en.wikipedia.org/wiki/Special:Random');
    const randomArticleLink = randomArticleRequest.url;

    await prisma.todo.create({
        data: {
            title: `Read: ${randomArticleLink}`,
        },
    });
}

main();
