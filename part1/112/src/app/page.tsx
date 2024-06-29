import Image from "next/image";

export default async function Home() {
  return (
    <main>
      <div style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '50vw', height: '50vh', position: 'relative' }}>
        <Image unoptimized src="/api" alt="Random image" fill style={{ objectFit: 'contain' }} />
      </div>
    </main>
  );
}
