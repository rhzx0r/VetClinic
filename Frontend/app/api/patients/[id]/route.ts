import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { fetchApi } from "@/lib/api-utils"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("auth_token")

    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Llamada a la API externa usando la utilidad
    const response = await fetchApi(`/api/patients/${params.id}`, {}, token.value)

    if (!response.ok) {
      return NextResponse.json({ error: "Error al obtener paciente" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error en patient GET:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("auth_token")

    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()

    // Llamada a la API externa usando la utilidad
    const response = await fetchApi(
      `/api/patients/${params.id}`,
      {
        method: "PUT",
        body: JSON.stringify(body),
      },
      token.value,
    )

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: errorData.error || "Error al actualizar paciente" },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error en patient PUT:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("auth_token")

    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Llamada a la API externa usando la utilidad
    const response = await fetchApi(
      `/api/patients/${params.id}`,
      {
        method: "DELETE",
      },
      token.value,
    )

    if (!response.ok) {
      return NextResponse.json({ error: "Error al eliminar paciente" }, { status: response.status })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error en patient DELETE:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
