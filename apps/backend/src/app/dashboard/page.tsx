import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload } from "lucide-react";

export default function HomePage() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <Tabs defaultValue="view-all">
            <TabsList>
              <TabsTrigger value="view-all">Analyze Video</TabsTrigger>
              <TabsTrigger value="documents">Results</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        {/* Empty state */}
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <span className="text-2xl">📁</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">No project files</h3>
          <p className="text-gray-500 mb-4">
             Upload a new video / photo.
          </p>
          <div className="flex justify-center space-x-2">
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" /> Upload
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
