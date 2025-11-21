import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Trash2, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Registration } from "@/pages/admin/Registrations";

interface RegistrationTableProps {
  registrations: Registration[];
  selectedRows: string[];
  onSelectedRowsChange: (selected: string[]) => void;
  onRowClick: (registration: Registration) => void;
}

const trackColors: Record<string, string> = {
  promptathon: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  buildathon: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  vibeathon: "bg-pink-500/10 text-pink-500 border-pink-500/20",
};

const teamStatusColors: Record<string, string> = {
  solo: "bg-muted text-muted-foreground",
  looking: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  "has-team": "bg-green-500/10 text-green-500 border-green-500/20",
};

export function RegistrationTable({
  registrations,
  selectedRows,
  onSelectedRowsChange,
  onRowClick,
}: RegistrationTableProps) {
  const [sortColumn, setSortColumn] = useState<keyof Registration>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSort = (column: keyof Registration) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedRegistrations = [...registrations].sort((a, b) => {
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    
    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const toggleSelectAll = () => {
    if (selectedRows.length === registrations.length) {
      onSelectedRowsChange([]);
    } else {
      onSelectedRowsChange(registrations.map((r) => r.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      onSelectedRowsChange(selectedRows.filter((rowId) => rowId !== id));
    } else {
      onSelectedRowsChange([...selectedRows, id]);
    }
  };

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedRows.length === registrations.length && registrations.length > 0}
                onCheckedChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead
              className="cursor-pointer hover:text-foreground"
              onClick={() => handleSort("full_name")}
            >
              Name
            </TableHead>
            <TableHead
              className="cursor-pointer hover:text-foreground"
              onClick={() => handleSort("email")}
            >
              Email
            </TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Track</TableHead>
            <TableHead>Team Status</TableHead>
            <TableHead>Challenges</TableHead>
            <TableHead
              className="cursor-pointer hover:text-foreground"
              onClick={() => handleSort("created_at")}
            >
              Registered
            </TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRegistrations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                No registrations found
              </TableCell>
            </TableRow>
          ) : (
            sortedRegistrations.map((registration) => (
              <TableRow
                key={registration.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onRowClick(registration)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedRows.includes(registration.id)}
                    onCheckedChange={() => toggleSelectRow(registration.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{registration.full_name}</TableCell>
                <TableCell className="text-muted-foreground">{registration.email}</TableCell>
                <TableCell>{registration.company || "—"}</TableCell>
                <TableCell className="capitalize">{registration.role}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={trackColors[registration.track.toLowerCase()]}>
                    {registration.track}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={teamStatusColors[registration.team_status.toLowerCase()]}>
                    {registration.team_status.replace("-", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {registration.challenges.slice(0, 2).map((challenge) => (
                      <Badge key={challenge} variant="secondary" className="text-xs">
                        {challenge}
                      </Badge>
                    ))}
                    {registration.challenges.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{registration.challenges.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDistanceToNow(new Date(registration.created_at), { addSuffix: true })}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => onRowClick(registration)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
