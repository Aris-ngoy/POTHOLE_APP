import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to Our Dashboard</h1>
      <p className="text-xl mb-8">Click below to access the dashboard</p>
      <Link 
        href="/dashboard" 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Go to Dashboard
      </Link>
    </main>
  )
}