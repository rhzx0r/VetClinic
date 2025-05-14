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
    const role = searchParams.get("role")
    const userId = searchParams.get("user_id")
    const startDate = searchParams.get("start_date")
    const endDate = searchParams.get("end_date")
    const type = searchParams.get("type_")

    // Construir URL para la API externa
    let apiEndpoint = `/api/stats?`

    if (role) apiEndpoint += `role=${role}&`
    if (userId) apiEndpoint += `user_id=${userId}&`
    if (startDate) apiEndpoint += `start_date=${startDate}&`
    if (endDate) apiEndpoint += `end_date=${endDate}&`
    if (type) apiEndpoint += `type_=${type}&`

    // Llamada a la API externa usando la utilidad
    const response = await fetchApi(apiEndpoint, {}, token.value)

    if (!response.ok) {
      return NextResponse.json({ error: "Error al obtener estadísticas" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error en stats:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
