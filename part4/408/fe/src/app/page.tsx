'use client';

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";

export default function Home() {
  const [todos, setTodos] = useState([]);

  const fetchTodos = async () => {
    const response = await fetch(`/todos/api`, { cache: 'no-cache', headers: { 'Content-Type': 'application/json' }})

    const data = await response.json();

    setTodos(data.data);
  };


  useEffect(() => {
    fetchTodos();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const todo = form.todo.value;

    await fetch(`/todos/api`, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: todo })
    });

    await fetchTodos();
  };

  return (
    <main>
      <div style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '50vw', height: '50vh', position: 'relative' }}>
        <Image unoptimized src="/api" alt="Random image" fill style={{ objectFit: 'contain' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <form style={{ display: 'flex' }} onSubmit={handleSubmit}>
          <input type="text" maxLength={140} name="todo" />
          <button>Create TODO</button>
        </form>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
      <ul>
          {todos.map((todo, index) => (
            <li key={index}>{todo}</li>
          ))}
        </ul>
        </div>
    </main>
  );
}
