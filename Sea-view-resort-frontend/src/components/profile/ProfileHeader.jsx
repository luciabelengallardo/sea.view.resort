import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card } from "../ui/Card";
import { Mail, MapPin, Calendar } from "lucide-react";
import { formatMemberSince } from "../../lib/formatters";

export function ProfileHeader({ user }) {
  return (
    <Card className="overflow-hidden">
      <div className="h-24 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20" />

      <div className="px-6 pb-6">
        <div className="flex items-end gap-6 -mt-16 mb-6">
          <Avatar className="size-32 border-4 border-card shadow-xl ring-2 ring-white/10">
            <AvatarFallback className="text-2xl bg-gradient-to-br from-primary/30 to-accent/30">
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 pb-1">
            <h1 className="text-3xl font-bold tracking-tight">{user.email}</h1>
            <p className="text-muted-foreground mt-1">Huésped</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="size-4" />
            <span>Miembro desde {formatMemberSince(user.createdAt)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
