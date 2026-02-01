import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/Button"
import { Card } from "../ui/Card"
import { Pencil, Mail, MapPin, Calendar } from "lucide-react"
import { EditProfileDialog } from "./EditProfileDialog"
import { formatMemberSince } from "../../lib/formatters"

export function ProfileHeader({ user, profileImage }) {
  const [isEditOpen, setIsEditOpen] = useState(false)

  return (
    <>
      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20" />

        <div className="px-6 pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <Avatar className="-mt-16 size-32 border-4 border-card shadow-xl">
                <AvatarImage src={profileImage} alt="Sea View" />
                <AvatarFallback className="text-2xl">SV</AvatarFallback>
              </Avatar>

              <div className="space-y-1 pb-2">
                <h1 className="text-3xl font-bold tracking-tight">{user.username}</h1>
                <p className="text-muted-foreground">Resort Guest</p>
              </div>
            </div>

            <Button onClick={() => setIsEditOpen(true)} className="gap-2">
              <Pencil className="size-4" />
              Editar Perfil
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="size-4" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="size-4" />
              <span>{user.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="size-4" />
              <span>Miembro desde {formatMemberSince(user.createdAt)}</span>
            </div>
          </div>
        </div>
      </Card>

      <EditProfileDialog open={isEditOpen} onOpenChange={setIsEditOpen} user={user} profileImage={profileImage} />
    </>
  )
}
