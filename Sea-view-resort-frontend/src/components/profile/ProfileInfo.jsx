import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card"
import { Separator } from "../ui/separator"
import { User } from "lucide-react"

export function ProfileInfo({ user }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="size-5" />
          Información Personal
        </CardTitle>
        <CardDescription>Detalles de tu cuenta y preferencias</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Nombre Completo</p>
            <p className="text-base">{user.firstName} {user.lastName}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Nombre de Usuario</p>
            <p className="text-base">{user.username}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <p className="text-base">{user.email}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
            <p className="text-base text-muted-foreground">{user.phone}</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Biografía</p>
          <p className="text-base leading-relaxed">
            {user.bio}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
