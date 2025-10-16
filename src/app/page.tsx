import Dashboard from '@/components/dashboard/Dashboard';

export default function Home() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(125,249,255,0.05),transparent_40%)]" />
      <Dashboard />
    </main>
  );
}
