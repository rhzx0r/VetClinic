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
    const phone = searchParams.get("phone")
    const assignedTo = searchParams.get("assigned_to")
    const limit = searchParams.get("limit") || "50"
    const offset = searchParams.get("offset") || "0"

    // Construir URL para la API externa
    let apiEndpoint = `/api/clients?limit=${limit}&offset=${offset}`

    if (name) apiEndpoint += `&name=${name}`
    if (phone) apiEndpoint += `&phone=${phone}`
    if (assignedTo) apiEndpoint += `&assigned_to=${assignedTo}`

    // Llamada a la API externa usando la utilidad
    const response = await fetchApi(apiEndpoint, {}, token.value)

    if (!response.ok) {
      return NextResponse.json({ error: "Error al obtener clientes" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error en clients:", error)
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
      "/api/clients",
      {
        method: "POST",
        body: JSON.stringify(body),
      },
      token.value,
    )

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json({ error: errorData.error || "Error al crear cliente" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error en clients POST:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
