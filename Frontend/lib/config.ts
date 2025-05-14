// Configuración centralizada de la aplicación

// Verificar que las variables de entorno necesarias estén definidas
if (!process.env.API_URL) {
  console.warn("⚠️ La variable de entorno API_URL no está definida. Usando URL por defecto.")
}

// Exportar configuración
export const config = {
  // URL base de la API
  apiUrl: process.env.API_URL || "http://micita-backend.onrender.com",

  // API Key para autenticación
  apiKey: "301cea66b40ddd8727a2eefbecd42141",

  // Tiempo de expiración del token en segundos (1 semana)
  tokenExpiration: 60 * 60 * 24 * 7,
}
