import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/Card";
import { Mail } from "lucide-react";

export function ProfileInfo({ user }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="size-5" />
          Información Personal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Email</p>
          <p className="text-base font-medium">{user.email}</p>
        </div>
      </CardContent>
    </Card>
  );
}
