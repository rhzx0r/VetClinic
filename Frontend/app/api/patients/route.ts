import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { fetchApi } from "@/lib/api-utils"

export async function GET(request: Request) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("auth_token")

    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Obtener parámetros de la URL
    const { searchParams } = new URL(request.url)
    const name = searchParams.get("name")
    const species = searchParams.get("species")
    const breedId = searchParams.get("breed_id")
    const clientId = searchParams.get("client_id")
    const gender = searchParams.get("gender")
    const limit = searchParams.get("limit") || "50"
    const offset = searchParams.get("offset") || "0"

    // Construir URL para la API externa
    let apiEndpoint = `/api/patients?limit=${limit}&offset=${offset}`

    if (name) apiEndpoint += `&name=${name}`
    if (species) apiEndpoint += `&species=${species}`
    if (breedId) apiEndpoint += `&breed_id=${breedId}`
    if (clientId) apiEndpoint += `&client_id=${clientId}`
    if (gender) apiEndpoint += `&gender=${gender}`

    // Llamada a la API externa usando la utilidad
    const response = await fetchApi(apiEndpoint, {}, token.value)

    if (!response.ok) {
      return NextResponse.json({ error: "Error al obtener pacientes" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error en patients:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("auth_token")

    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()

    // Llamada a la API externa usando la utilidad
    const response = await fetchApi(
      "/api/patients",
      {
        method: "POST",
        body: JSON.stringify(body),
      },
      token.value,
    )

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json({ error: errorData.error || "Error al crear paciente" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error en patients POST:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
