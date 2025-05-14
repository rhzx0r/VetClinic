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
    const patientId = searchParams.get("patient_id")
    const clientId = searchParams.get("client_id")
    const veterinarianId = searchParams.get("veterinarian_id")
    const status = searchParams.get("status")
    const startDate = searchParams.get("start_date")
    const endDate = searchParams.get("end_date")
    const reasonContains = searchParams.get("reason_contains")
    const limit = searchParams.get("limit") || "50"
    const offset = searchParams.get("offset") || "0"

    // Construir URL para la API externa
    let apiEndpoint = `/api/appointments?limit=${limit}&offset=${offset}`

    if (patientId) apiEndpoint += `&patient_id=${patientId}`
    if (clientId) apiEndpoint += `&client_id=${clientId}`
    if (veterinarianId) apiEndpoint += `&veterinarian_id=${veterinarianId}`
    if (status) apiEndpoint += `&status=${status}`
    if (startDate) apiEndpoint += `&start_date=${startDate}`
    if (endDate) apiEndpoint += `&end_date=${endDate}`
    if (reasonContains) apiEndpoint += `&reason_contains=${reasonContains}`

    // Llamada a la API externa usando la utilidad
    const response = await fetchApi(apiEndpoint, {}, token.value)

    if (!response.ok) {
      return NextResponse.json({ error: "Error al obtener citas" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error en appointments:", error)
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
      "/api/appointments",
      {
        method: "POST",
        body: JSON.stringify(body),
      },
      token.value,
    )

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json({ error: errorData.error || "Error al crear cita" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error en appointments POST:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
