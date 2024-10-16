
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { Check, Code } from "lucide-react"
import { FC, useState } from "react"

const DisplayCode : FC<Props> = ({ code, title }) => {
  return (
    <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline" size="icon" aria-label={`View ${title}`}>
        <Code className="h-4 w-4" />
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <DisplayCodeItem code={code} title={title} />
    </DialogContent>
  </Dialog>
  )
}

const DisplayCodeItem: FC<Props> = ({ code, title }) => {
    const [isCopied, setIsCopied] = useState(false)
    const { toast } = useToast()
  
    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(code)
        setIsCopied(true)
        toast({
          title: 'Copied to clipboard!',
          description: 'The code has been copied to your clipboard.',
        })
        setTimeout(() => setIsCopied(false), 2000) // Reset after 2 seconds
      } catch (err) {
        console.error('Failed to copy text: ', err)
      }
    }
  
    return (
      <div className="grid w-full gap-4 text-sm">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium leading-none">{title}</h4>
          <Button size="sm" onClick={handleCopy}>
            {isCopied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied
              </>
            ) : (
              'Copy'
            )}
          </Button>
        </div>
        <ScrollArea className="max-h-[400px] rounded-md border">
          <pre className="language-json m-0">
            <code className="font-mono">{code}</code>
          </pre>
        </ScrollArea>
      </div>
    )
}

export { DisplayCodeItem, DisplayCode }

type Props = {
    title : string
    code : string
}