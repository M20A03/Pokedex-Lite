import { useMemo } from 'react';

export default function Sparkles() {
  const particles = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: `${Math.random() * 100}%`,
      duration: `${6 + Math.random() * 12}s`,
      delay: `${Math.random() * 10}s`,
      size: `${2 + Math.random() * 4}px`,
    }));
  }, []);

  return (
    <div className="sparkle-container" aria-hidden="true">
      {particles.map(p => (
        <div
          key={p.id}
          className="sparkle"
          style={{
            '--x': p.x,
            '--duration': p.duration,
            '--delay': p.delay,
            width: p.size,
            height: p.size,
          }}
        />
      ))}
    </div>
  );
}
