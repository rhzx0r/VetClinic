"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Search, Calendar, Clock, User, Dog, Pencil, Trash2, Info } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Datos estáticos de ejemplo para selects
const staticPatients = [
  { id: 1, name: "Luna" },
  { id: 2, name: "Milo" },
  { id: 3, name: "Kiwi" },
  { id: 4, name: "Rocky" },
]
const staticClients = [
  { id: 1, name: "Juan Pérez" },
  { id: 2, name: "Ana Gómez" },
  { id: 3, name: "Carlos Ruiz" },
  { id: 4, name: "Lucía Fernández" },
]
const staticVets = [
  { id: 1, name: "Dra. Martínez" },
  { id: 2, name: "Dr. López" },
]

interface Appointment {
  id: number
  patient_id: number
  patient_name: string
  client_id: number
  client_name: string
  veterinarian_id: number
  veterinarian_name: string
  start_time: string
  end_time: string
  status: string
  reason: string
  duration_minutes: number
}

export default function AppointmentsPage() {

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newAppointment, setNewAppointment] = useState({
    patient_id: staticPatients[0].id,
    client_id: staticClients[0].id,
    veterinarian_id: staticVets[0].id,
    start_time: "",
    end_time: "",
    status: "Scheduled",
    reason: "",
    duration_minutes: 30,
  })

  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault()
    const patient = staticPatients.find(p => p.id === Number(newAppointment.patient_id))
    const client = staticClients.find(c => c.id === Number(newAppointment.client_id))
    const vet = staticVets.find(v => v.id === Number(newAppointment.veterinarian_id))
    const id = appointments.length ? Math.max(...appointments.map(a => a.id)) + 1 : 1

    setAppointments([
      ...appointments,
      {
        id,
        patient_id: Number(newAppointment.patient_id),
        patient_name: patient?.name || "",
        client_id: Number(newAppointment.client_id),
        client_name: client?.name || "",
        veterinarian_id: Number(newAppointment.veterinarian_id),
        veterinarian_name: vet?.name || "",
        start_time: newAppointment.start_time,
        end_time: newAppointment.end_time,
        status: newAppointment.status,
        reason: newAppointment.reason,
        duration_minutes: Number(newAppointment.duration_minutes),
      },
    ])
    setIsAddDialogOpen(false)
    setNewAppointment({
      patient_id: staticPatients[0].id,
      client_id: staticClients[0].id,
      veterinarian_id: staticVets[0].id,
      start_time: "",
      end_time: "",
      status: "Scheduled",
      reason: "",
      duration_minutes: 30,
    })
  }

  // DATOS ESTÁTICOS INICIO
  const staticAppointments: Appointment[] = [
    {
      id: 1,
      patient_id: 1,
      patient_name: "Luna",
      client_id: 1,
      client_name: "Juan Pérez",
      veterinarian_id: 1,
      veterinarian_name: "Dra. Martínez",
      start_time: "2025-05-13T09:00:00",
      end_time: "2025-05-13T09:30:00",
      status: "Scheduled",
      reason: "Vacunación anual",
      duration_minutes: 30,
    },
    {
      id: 2,
      patient_id: 2,
      patient_name: "Milo",
      client_id: 2,
      client_name: "Ana Gómez",
      veterinarian_id: 2,
      veterinarian_name: "Dr. López",
      start_time: "2025-05-13T10:00:00",
      end_time: "2025-05-13T10:20:00",
      status: "Completed",
      reason: "Consulta general",
      duration_minutes: 20,
    },
    {
      id: 3,
      patient_id: 3,
      patient_name: "Kiwi",
      client_id: 3,
      client_name: "Carlos Ruiz",
      veterinarian_id: 1,
      veterinarian_name: "Dra. Martínez",
      start_time: "2025-05-12T11:00:00",
      end_time: "2025-05-12T11:15:00",
      status: "Canceled",
      reason: "Revisión de ala",
      duration_minutes: 15,
    },
    {
      id: 4,
      patient_id: 4,
      patient_name: "Rocky",
      client_id: 4,
      client_name: "Lucía Fernández",
      veterinarian_id: 2,
      veterinarian_name: "Dr. López",
      start_time: "2025-05-14T12:00:00",
      end_time: "2025-05-14T12:30:00",
      status: "NoShow",
      reason: "Control de peso",
      duration_minutes: 30,
    },
  ]
  const [appointments, setAppointments] = useState<Appointment[]>(staticAppointments)
  const [loading, setLoading] = useState(false)
  // DATOS ESTÁTICOS FIN

  // const [appointments, setAppointments] = useState<Appointment[]>([])
  // const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const { toast } = useToast()

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/appointments")

      if (!response.ok) {
        throw new Error("Error al cargar citas")
      }

      const data = await response.json()
      setAppointments(data)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar las citas",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAppointment = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta cita?")) {
      return
    }

    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Error al eliminar cita")
      }

      setAppointments(appointments.filter((appointment) => appointment.id !== id))

      toast({
        title: "Cita eliminada",
        description: "La cita ha sido eliminada exitosamente",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar la cita",
      })
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Canceled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "NoShow":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "Programada"
      case "Completed":
        return "Completada"
      case "Canceled":
        return "Cancelada"
      case "NoShow":
        return "No asistió"
      default:
        return status
    }
  }

  const formatDateTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString)
      return format(date, "dd MMM yyyy, HH:mm", { locale: es })
    } catch (error) {
      return dateTimeString
    }
  }

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.veterinarian_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.reason.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "" || appointment.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Citas</h2>
        <div className="flex items-center justify-between">
          {/* <h2 className="text-3xl font-bold tracking-tight">Citas</h2> */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nueva Cita
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Nueva Cita</DialogTitle>
                <DialogDescription>Completa los datos de la cita</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddAppointment} className="space-y-4">
                <div>
                  <Label>Paciente</Label>
                  <select
                    className="w-full border rounded px-2 py-1"
                    value={newAppointment.patient_id}
                    onChange={e => setNewAppointment({ ...newAppointment, patient_id: Number(e.target.value) })}
                    required
                  >
                    {staticPatients.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Cliente</Label>
                  <select
                    className="w-full border rounded px-2 py-1"
                    value={newAppointment.client_id}
                    onChange={e => setNewAppointment({ ...newAppointment, client_id: Number(e.target.value) })}
                    required
                  >
                    {staticClients.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Veterinario</Label>
                  <select
                    className="w-full border rounded px-2 py-1"
                    value={newAppointment.veterinarian_id}
                    onChange={e => setNewAppointment({ ...newAppointment, veterinarian_id: Number(e.target.value) })}
                    required
                  >
                    {staticVets.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Fecha y Hora de Inicio</Label>
                  <Input
                    type="datetime-local"
                    value={newAppointment.start_time}
                    onChange={e => setNewAppointment({ ...newAppointment, start_time: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Fecha y Hora de Fin</Label>
                  <Input
                    type="datetime-local"
                    value={newAppointment.end_time}
                    onChange={e => setNewAppointment({ ...newAppointment, end_time: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Duración (minutos)</Label>
                  <Input
                    type="number"
                    min={1}
                    value={newAppointment.duration_minutes}
                    onChange={e => setNewAppointment({ ...newAppointment, duration_minutes: Number(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label>Motivo</Label>
                  <Textarea
                    value={newAppointment.reason}
                    onChange={e => setNewAppointment({ ...newAppointment, reason: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Estado</Label>
                  <select
                    className="w-full border rounded px-2 py-1"
                    value={newAppointment.status}
                    onChange={e => setNewAppointment({ ...newAppointment, status: e.target.value })}
                    required
                  >
                    <option value="Scheduled">Programada</option>
                    <option value="Completed">Completada</option>
                    <option value="Canceled">Cancelada</option>
                    <option value="NoShow">No asistió</option>
                  </select>
                </div>
                <DialogFooter>
                  <Button type="submit">Guardar</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-2 md:space-y-0">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar citas..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="Scheduled">Programadas</SelectItem>
            <SelectItem value="Completed">Completadas</SelectItem>
            <SelectItem value="Canceled">Canceladas</SelectItem>
            <SelectItem value="NoShow">No asistió</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Citas</CardTitle>
          <CardDescription>Gestiona las citas de la clínica veterinaria</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha y Hora</TableHead>
                    <TableHead>Paciente</TableHead>
                    <TableHead className="hidden md:table-cell">Cliente</TableHead>
                    <TableHead className="hidden md:table-cell">Veterinario</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No se encontraron citas
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAppointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="flex items-center font-medium">
                              <Calendar className="mr-1 h-3 w-3" />
                              {formatDateTime(appointment.start_time)}
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="mr-1 h-3 w-3" />
                              {appointment.duration_minutes} minutos
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Dog className="mr-1 h-4 w-4" />
                            {appointment.patient_name}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center">
                            <User className="mr-1 h-4 w-4" />
                            {appointment.client_name}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{appointment.veterinarian_name}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`flex w-fit items-center ${getStatusBadgeColor(appointment.status)}`}
                          >
                            {getStatusText(appointment.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Acciones</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/appointments/${appointment.id}`}>
                                  <Info className="mr-2 h-4 w-4" />
                                  Ver detalles
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/appointments/${appointment.id}/edit`}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Editar
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDeleteAppointment(appointment.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
