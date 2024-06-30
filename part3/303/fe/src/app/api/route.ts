import fs from 'fs';
import { Readable } from 'stream';
import { finished } from 'stream/promises';

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
    // Read or create /tmp/random-image.jpg
    // Image is cached per hour

    const hour = new Date().getHours();

    const path = `/tmp/random-image-${hour}.jpg`;

    if (!fs.existsSync(path)) {
        const res = await fetch('https://picsum.photos/1200')

        if (!res.body) {
            return new Response(null, { status: 500 });
        }

        const fileStream = fs.createWriteStream(path);

        // Ignore type error
        // @ts-ignore
        await finished(Readable.fromWeb(res.body).pipe(fileStream));
    } 

    const image = fs.readFileSync(path);

    return new Response(image, {
        headers: {
            'Content-Type': 'image/jpeg'
        }
    });
}