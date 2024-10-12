import { Navbar } from "@/components/navbar"
import { SideBar } from "@/components/sidebar"

export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <SideBar />
        {/* Main content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* File browser */}
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}


