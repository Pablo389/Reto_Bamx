# Correr el backend

Asegurarse de estar en la carpeta /backend

```bash
npm install
```
### Configura la base de datos PostgreSQL:

Asegúrate de que PostgreSQL esté corriendo en tu máquina. Luego, crea una base de datos para el proyecto:

```bash
psql -U postgres -c "CREATE DATABASE nombre_de_tu_db;"
```

### Configura las variables de entorno:

Crea un archivo .env en la raíz del proyecto con el siguiente contenido:

```makefile
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=nombre_de_tu_db
PORT=numero_de_puerto
```
## Scripts disponibles

### Correr el servidor de desarrollo:

```bash
npm run dev
```
El servidor estará corriendo en http://localhost:3000.

### Migraciones

Antes de correr el servidor, asegúrate de que tu tabla users esté creada en la base de datos. Puedes usar la siguiente consulta SQL para crear la tabla:

```sql

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  birth_date DATE NOT NULL
);

```

## Rutas disponibles
- GET /api/users: Obtiene todos los usuarios.
- GET /api/users/:id : Obtiene un usuario por su ID.
- POST /api/users: Crea un nuevo usuario. El cuerpo de la solicitud debe incluir name, email, password y birth_date.