/**
 * Utilidades para interactuar con la API externa
 */
import { config } from "./config"

/**
 * Obtiene los headers comunes para todas las solicitudes a la API
 * @param token Token de autenticación JWT (opcional)
 * @returns Headers para la solicitud
 */
export function getApiHeaders(token?: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-API-KEY": config.apiKey,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  return headers
}

/**
 * Realiza una solicitud a la API externa
 * @param endpoint Endpoint de la API (sin la URL base)
 * @param options Opciones de fetch
 * @param token Token de autenticación JWT (opcional)
 * @returns Respuesta de la API
 */
export async function fetchApi(endpoint: string, options: RequestInit = {}, token?: string) {
  // Normalizar la URL base y el endpoint
  const baseUrl = config.apiUrl.endsWith("/") ? config.apiUrl.slice(0, -1) : config.apiUrl

  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`

  const url = `${baseUrl}${normalizedEndpoint}`

  console.log(`Realizando solicitud a: ${url}`)

  const headers = getApiHeaders(token)

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    })

    return response
  } catch (error) {
    console.error(`Error en solicitud a ${url}:`, error)
    throw error
  }
}
