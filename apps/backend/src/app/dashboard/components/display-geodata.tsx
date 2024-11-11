'use client'

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { Check, MapPin } from "lucide-react"
import { FC, useState } from "react"
import { GeolocationData } from "../models/process.file.model"

const DisplayGeolocation: FC<{ data: GeolocationData }> = ({ data }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" aria-label="View Geolocation Data">
          <MapPin className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Geolocation Data</DialogTitle>
        </DialogHeader>
        <DisplayGeolocationItem data={data} />
      </DialogContent>
    </Dialog>
  )
}

const DisplayGeolocationItem: FC<{ data: GeolocationData }> = ({ data }) => {
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2))
      setIsCopied(true)
      toast({
        title: 'Copied to clipboard!',
        description: 'The geolocation data has been copied to your clipboard.',
      })
      setTimeout(() => setIsCopied(false), 2000) // Reset after 2 seconds

      console.log('Geolocation Data:', data.latitude, data.longitude)

      // Open Google Maps with the latitude and longitude
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${data.latitude},${data.longitude}`
      window.open(mapsUrl, '_blank')
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className="grid w-full gap-4 text-sm">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium leading-none">Geolocation Details</h4>
        <Button size="sm" onClick={handleCopy}>
          {isCopied ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Copied & Opened Map
            </>
          ) : (
            'Copy & Open Map'
          )}
        </Button>
      </div>
      <ScrollArea className="max-h-[400px] rounded-md border">
        <pre className="p-4">
          <code className="text-xs">{JSON.stringify(data, null, 2)}</code>
        </pre>
      </ScrollArea>
    </div>
  )
}

export { DisplayGeolocationItem, DisplayGeolocation }
