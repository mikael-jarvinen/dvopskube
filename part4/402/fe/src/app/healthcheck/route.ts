export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
    return new Response('OK', {
        status: 200,
        headers: {
        'content-type': 'text/plain',
        },
    })
}