import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { fetchApi } from "@/lib/api-utils"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Llamada a la API externa usando la utilidad
    const response = await fetchApi("/api/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    const data = await response.json()

    // Guardar token en cookie
    const cookieStore = cookies()
    cookieStore.set("auth_token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 semana
      path: "/",
    })

    // Guardar información básica del usuario en otra cookie
    cookieStore.set(
      "user_info",
      JSON.stringify({
        id: data.user.id,
        name: data.user.name,
        role: data.user.role,
      }),
      {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 semana
        path: "/",
      },
    )

    return NextResponse.json({
      user: {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
      },
    })
  } catch (error) {
    console.error("Error en login:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
