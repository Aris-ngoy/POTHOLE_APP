// import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Upload } from "lucide-react";
import FileUploader from "./components/file-upload";

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
          <FileUploader />
        </div>
      </CardContent>
    </Card>
  );
}
