import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Play } from 'lucide-react'
import React, { FC } from 'react'

type Props = {
  title: string
  url: string
  type: 'image' | 'video'
  width?: number
  height?: number
}

const ImageVideoItem: FC<Props> = ({ type, title, url }) => {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" aria-label={`View ${type}: ${title}`}>
            <Play className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='text-sm'>{title}</DialogTitle>
          </DialogHeader>
          {type === 'image' ? (
            <div className="relative w-full h-[400px]">
              <Image
                src={url}
                alt={title}
                fill
                aria-describedby='image-description'
                sizes="(max-width: 425px) 100vw, 425px"
                className="object-contain"
              />
            </div>
          ) : (
            <video controls className="w-full">
              <source src={url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </DialogContent>
      </Dialog>
    );
  };
  
export { ImageVideoItem }