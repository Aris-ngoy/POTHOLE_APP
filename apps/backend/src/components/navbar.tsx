import React from 'react'
import { FC } from 'react'
import { Button } from './ui/button'
import { Bell } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const Navbar : FC = ()=> {
  return (
    <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
            <div className="font-semibold text-lg">Dashboard</div>
            <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
            </Button>
            <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            </div>
        </div>
        </div>
    </header>
  )
}

export { Navbar }

