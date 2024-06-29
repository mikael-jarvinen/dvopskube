import Image from "next/image";

export default async function Home() {
  const todos = [
    'TODO 1',
    'TODO 2',
  ];

  return (
    <main>
      <div style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '50vw', height: '50vh', position: 'relative' }}>
        <Image unoptimized src="/api" alt="Random image" fill style={{ objectFit: 'contain' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex' }}>
          <input type="text" maxLength={140} />
          <button>Create TODO</button>
        </div>
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
