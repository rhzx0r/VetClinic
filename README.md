# 🐾 VetClinic - Plataforma de Gestión de Citas de Mascotas

**VetClinic** es una aplicación web diseñada para facilitar la gestión de citas entre usuarios y profesionales del área médica, legal u otras especialidades. Esta plataforma permite a los usuarios registrarse con una cuenta personal para agendar citas, y a los profesionales crear un perfil para ofrecer sus servicios.

## 📌 Características principales

- Registro de cuentas profesionales.
- Autenticación y gestión de sesiones.
- Interfaz intuitiva y adaptable (diseño responsivo).
- Componentes reutilizables con ShadCN y Tailwind CSS.
- Estructura modular con Next.js y React.
- Backend desarrollado en **Rust** utilizando **Actix Web** para alto rendimiento.
- Persistencia de datos con **PostgreSQL**.
- API RESTful eficiente para comunicación entre frontend y backend.

## 📸 Vista previa de la aplicación

![Vista previa login](img/login.jpeg)
![Vista previa pacientes](img/pacientes.jpeg)
![Vista previa citas](img/citas.jpeg)

## 🧩 Diagrama de arquitectura

![Diagrama](img/uml.jpeg)

## 🛠️ Tecnologías utilizadas

- **Next.js 14** — Framework React para SSR y SPA.
- **React** — Librería base para componentes de UI.
- **TypeScript** — Tipado estático para mayor seguridad.
- **Tailwind CSS** — Framework de estilos utilitario.
- **ShadCN UI** — Librería de componentes accesibles y elegantes.
- **Rust con Actix Web** — Backend rápido y seguro basado en Rust, ideal para APIs web de alto rendimiento.
- **PostgreSQL** — Base de datos relacional robusta y escalable utilizada para persistencia de datos.

## 🔧 Instalación y ejecución local

## Clona el repositorio:
   ```bash
   git clone 
   cd VetClinic

## 🖥️ Frontend

1. Entrar al front e instalar las dependencias:
   ```bash
   cd Frontend
   npm install

2. Inicia el servidor de desarrollo:
   ```
   npm run dev

3. Abre tu navegador y visita http://localhost:3000

## ⚙️ Backend

1. Configura las variables de entorno en un archivo `.env`:
```bash
cd Backend
DATABASE_URL=postgres://usuario:contraseña@localhost:5432/nombre_db
API_KEY=api_key_fuerte
ALLOWED_ORIGIN=localhost
JWT_SECRET=token_magico
```

2.Crea la base de datos y ejecuta los scripts de inicialización en `init.sql`:
```bash
psql -U usuario -d nombre_db -f init.sql/0.sql
psql -U usuario -d nombre_db -f init.sql/1.sql
```

3. Instala las dependencias del proyecto:
```bash
cargo build
```

4. Inicia el servidor:
```bash
cargo run
```

> El servidor estará disponible en `http://localhost:8080`.

## 🎯 Objetivos del proyecto

- Aplicar conceptos clave de sistemas distribuidos, como separación de responsabilidades, escalabilidad y comunicación entre componentes.

- Desarrollar una arquitectura modular que permita extender fácilmente el sistema con microservicios o APIs externas.

- Implementar una base para futuras integraciones como balanceo de carga, almacenamiento distribuido o despliegue en múltiples instancias.

- Utilizar herramientas modernas (Next.js, Tailwind, ShadCN, Rust, Actix, Postgresql) que favorezcan el desarrollo desacoplado de la aplicación.

- Fomentar buenas prácticas en diseño de interfaces distribuidas y preparación para ambientes en la nube o contenedores (ej. Hostings, VPS, etc.).

## 👨‍🏫 Información académica

- Proyecto universitario desarrollado para la materia de Sistemas distribuidos
- Docente: José Luís López Martínez
- Institución: Universidad Autónoma de Yucatán.
- Equipo:  
 
  Ricardo Reyes Balam Cupul **[Desarrollador Frontend]**  

  Angel Alejandro Balderas Pech **[Desarrollador Backend]**  

  Erik Yamily Agilar Itza **[Tester/Documentadora]**  
## 📄 Licencia
Este proyecto es de uso académico y no está destinado a producción. Para propósitos educativos solamente.