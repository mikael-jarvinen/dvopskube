export const dynamic = 'force-dynamic'

const apiUrl = process.env.API_URL || 'http://localhost:3001';

export async function GET(req: Request) {
    const todosRequest = await fetch(`${apiUrl}/todo-backend`, { headers: { 'Content-Type': 'application/json' }});

    const todos = await todosRequest.json();

    const response = Response.json({ data: todos.data });

    response.headers.set('Access-Control-Allow-Origin', '*');

    return response;
}

export async function POST(req: Request) {
    const data = await req.json();
    const todoRequest = await fetch(
        `${apiUrl}/todo-backend`,
        { headers: { 'Content-Type': 'application/json' }, method: 'POST', body: JSON.stringify(data) }
    );

    const todos = await todoRequest.json();

    const response = Response.json({ data: todos.data });

    response.headers.set('Access-Control-Allow-Origin', '*');

    return response;
}