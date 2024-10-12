import { BarChart2, FileText, Home } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { FC } from 'react'

const SideBar: FC = () => {
  return (
    <aside className="w-64 bg-white p-4 hidden md:block">
          <nav className="space-y-2">
            {[
              { name: "Home", icon: Home, href: "/dashboard" },
              { name: "Analytics", icon: BarChart2, href: "/dashboard/analytics" },
              { name: "Reports", icon: FileText, href: "/dashboard/report" }
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 px-2 py-1.5 rounded hover:bg-gray-100">
                <item.icon className="w-5 h-5 text-gray-500" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
    </aside>
  )
}

export { SideBar }