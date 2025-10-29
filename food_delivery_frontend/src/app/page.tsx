export default function Home() {
  return (
    <main className="min-h-screen bg-app flex items-center justify-center p-6">
      <div className="card max-w-2xl w-full text-center">
        <h1 className="text-4xl font-semibold text-primary mb-2">
          Ocean Professional Theme Ready
        </h1>
        <p className="text-app mb-6">
          The global theme and Tailwind utilities are now aligned with the project style guide.
        </p>
        <div className="flex items-center justify-center gap-3">
          <span className="badge">Next.js</span>
          <span className="badge">Tailwind v4</span>
          <span className="badge">Theming</span>
        </div>
      </div>
    </main>
  );
}
