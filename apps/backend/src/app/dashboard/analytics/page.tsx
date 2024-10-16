import { Card, CardContent } from "@/components/ui/card";
import DataTable from "../components/analytics-table"; // Changed to default import

export default function Analytics() {
    return(
        <Card>
            <CardContent className="p-4">
                <DataTable />
            </CardContent>
        </Card>
    )
}
