"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Search, Pencil, Trash2, Dog, Cat, Bird, Info } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface Patient {
  id: number
  name: string
  species: string
  breed: string
  breed_id: number
  birth_date: string | null
  gender: string | null
  weight_kg: number | null
  client_id: number
  photo_url: string | null
}

export default function PatientsPage() {
  // DATOS ESTÁTICOS INICIO
  const staticPatients: Patient[] = [
    {
      id: 1,
      name: "Luna",
      species: "Dog",
      breed: "Labrador",
      breed_id: 1,
      birth_date: "2020-01-01",
      gender: "Hembra",
      weight_kg: 25,
      client_id: 1,
      photo_url: null,
    },
    {
      id: 2,
      name: "Milo",
      species: "Cat",
      breed: "Siames",
      breed_id: 2,
      birth_date: "2019-05-10",
      gender: "Macho",
      weight_kg: 6,
      client_id: 2,
      photo_url: null,
    },
    {
      id: 3,
      name: "Kiwi",
      species: "Bird",
      breed: "Periquito",
      breed_id: 3,
      birth_date: "2022-03-15",
      gender: "Macho",
      weight_kg: 0.05,
      client_id: 3,
      photo_url: null,
    },
    {
      id: 4,
      name: "Rocky",
      species: "Reptile",
      breed: "Iguana",
      breed_id: 4,
      birth_date: "2018-07-20",
      gender: "Macho",
      weight_kg: 2,
      client_id: 4,
      photo_url: null,
    },
    {
      id: 5,
      name: "Nina",
      species: "Rabbit",
      breed: "Enano",
      breed_id: 5,
      birth_date: "2021-11-11",
      gender: "Hembra",
      weight_kg: 1.2,
      client_id: 5,
      photo_url: null,
    },
  ]
  const [patients, setPatients] = useState<Patient[]>(staticPatients)
  const [loading, setLoading] = useState(false)
  // DATOS ESTÁTICOS FIN

  // const [patients, setPatients] = useState<Patient[]>([])
  // const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [speciesFilter, setSpeciesFilter] = useState<string>("")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/patients")

      if (!response.ok) {
        throw new Error("Error al cargar pacientes")
      }

      const data = await response.json()
      setPatients(data)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los pacientes",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePatient = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este paciente?")) {
      return
    }

    try {
      const response = await fetch(`/api/patients/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Error al eliminar paciente")
      }

      setPatients(patients.filter((patient) => patient.id !== id))

      toast({
        title: "Paciente eliminado",
        description: "El paciente ha sido eliminado exitosamente",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el paciente",
      })
    }
  }

  const getSpeciesIcon = (species: string) => {
    switch (species) {
      case "Dog":
        return <Dog className="h-4 w-4" />
      case "Cat":
        return <Cat className="h-4 w-4" />
      case "Bird":
        return <Bird className="h-4 w-4" />
      default:
        return <Dog className="h-4 w-4" />
    }
  }

  const getSpeciesBadgeColor = (species: string) => {
    switch (species) {
      case "Dog":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Cat":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Bird":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Reptile":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "Rodent":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "Rabbit":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.breed.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecies = speciesFilter === "" || patient.species === speciesFilter

    return matchesSearch && matchesSpecies
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Pacientes</h2>
        <Button asChild>
          <Link href="/patients/new">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Paciente
          </Link>
        </Button>
      </div>

      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-2 md:space-y-0">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar pacientes..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={speciesFilter} onValueChange={setSpeciesFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Todas las especies" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las especies</SelectItem>
            <SelectItem value="Dog">Perros</SelectItem>
            <SelectItem value="Cat">Gatos</SelectItem>
            <SelectItem value="Bird">Aves</SelectItem>
            <SelectItem value="Reptile">Reptiles</SelectItem>
            <SelectItem value="Rodent">Roedores</SelectItem>
            <SelectItem value="Rabbit">Conejos</SelectItem>
            <SelectItem value="Other">Otros</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Pacientes</CardTitle>
          <CardDescription>Gestiona los pacientes de la clínica veterinaria</CardDescription>
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
                    <TableHead>Nombre</TableHead>
                    <TableHead>Especie</TableHead>
                    <TableHead className="hidden md:table-cell">Raza</TableHead>
                    <TableHead className="hidden md:table-cell">Género</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No se encontraron pacientes
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPatients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell>
                          <div className="font-medium">{patient.name}</div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`flex w-fit items-center gap-1 ${getSpeciesBadgeColor(patient.species)}`}
                          >
                            {getSpeciesIcon(patient.species)}
                            {patient.species}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{patient.breed || "—"}</TableCell>
                        <TableCell className="hidden md:table-cell">{patient.gender || "—"}</TableCell>
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
                                <Link href={`/patients/${patient.id}`}>
                                  <Info className="mr-2 h-4 w-4" />
                                  Ver detalles
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/patients/${patient.id}/edit`}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Editar
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDeletePatient(patient.id)}
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
