import { NextResponse } from "next/server"
import { fetchApi } from "@/lib/api-utils"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password, role, license_number } = body

    // Validaciones básicas
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 })
    }

    if (role === "Veterinarian" && !license_number) {
      return NextResponse.json({ error: "El número de licencia es obligatorio para veterinarios" }, { status: 400 })
    }

    // Preparar datos para la API
    const userData = {
      name,
      email,
      password,
      role,
      license_number: role === "Veterinarian" ? license_number : undefined,
    }

    console.log("Intentando registrar usuario:", { ...userData, password: "***" })

    try {
      // Llamada a la API externa usando la utilidad
      const response = await fetchApi("/api/users", {
        method: "POST",
        body: JSON.stringify(userData),
      })

      console.log("Respuesta de registro:", {
        status: response.status,
        statusText: response.statusText,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Error desconocido" }))
        console.error("Error de API en registro:", errorData)
        return NextResponse.json(
          { error: errorData.error || `Error al registrar usuario: ${response.status} ${response.statusText}` },
          { status: response.status },
        )
      }

      const data = await response.json()
      return NextResponse.json({ success: true, user: data })
    } catch (fetchError) {
      console.error("Error de fetch en registro:", fetchError)
      return NextResponse.json(
        { error: `Error de conexión: ${fetchError instanceof Error ? fetchError.message : "Error desconocido"}` },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error general en registro:", error)
    return NextResponse.json(
      { error: `Error interno del servidor: ${error instanceof Error ? error.message : "Error desconocido"}` },
      { status: 500 },
    )
  }
}
