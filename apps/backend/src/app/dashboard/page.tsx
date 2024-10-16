import { Card, CardContent } from "@/components/ui/card";
import FileUploader from "./components/file-upload";

export default function HomePage() {
  return (
    <Card>
      <CardContent className="p-6">
        {/* Empty state */}
        <div className="text-center py-12">
          <FileUploader />
        </div>
      </CardContent>
    </Card>
  );
}
