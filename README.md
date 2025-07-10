# Sistema de Gestión - Versión Simple

Esta es una versión simplificada del sistema de gestión desarrollada con HTML, CSS y JavaScript vanilla, utilizando Tailwind CSS para el diseño y conectada a la API real de `arquitecturas-web-api`.

## 🚀 Estructura del Proyecto

```
arquitecturas-web-front(simple)/
├── index.html                 # Página principal (TODO EN UNO)
├── assets/css/styles.css      # Estilos personalizados
├── package.json              # Configuración de Node.js
├── server.js                  # Servidor proxy para desarrollo
├── nginx.conf                 # Configuración nginx (opcional)
├── test.html                  # Archivo de prueba
├── index-simple.html          # Versión de respaldo
└── README.md                  # Este archivo
```

## 📋 Características Implementadas

### 🔐 Autenticación Real
- ✅ **Login** con API real (`POST /api/iam/login`)
- ✅ **Registro** con API real (`POST /api/iam/registro`)
- ✅ **Refresh Token** automático (`POST /api/iam/refresh`)
- ✅ **JWT Token** manejo y decodificación
- ✅ **Logout** con limpieza de tokens

### 📚 Gestión de Libros
- ✅ **Listar libros** del usuario (`GET /api/books`)
- ✅ **Crear libro** (`POST /api/books`)
- ✅ **Editar libro** (`PUT /api/books/{id}`)
- ✅ **Eliminar libro** (`DELETE /api/books/{id}`)
- ✅ **Validación** de formularios
- ✅ **Manejo de errores** de API

### 🎨 Interfaz de Usuario
- ✅ **Responsive Design** con Tailwind CSS
- ✅ **SPA Router** con hash navigation
- ✅ **Layout Template** con header y logout
- ✅ **Notificaciones** de éxito/error
- ✅ **Estados de carga** con spinners
- ✅ **Animaciones** fade-in

### 🔧 Funcionalidades Técnicas
- ✅ **Automatic Token Refresh** en requests
- ✅ **Error Handling** centralizado
- ✅ **CORS Configuration** para desarrollo
- ✅ **Proxy Server** para evitar CORS
- ✅ **Estado de sesión** persistente

## 🛠 Configuración y Uso

### Configuración Inicial

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar variables de entorno**:

3. **Editar archivo `.env`** según tu configuración:
   ```bash
   # API Configuration
   API_URL=https://localhost:7048
   API_BASE_URL=https://localhost:7048/api
   
   # Server Configuration  
   PORT=3000
   
   # Environment
   NODE_ENV=development
   ```

### Opción 1: Servidor Node.js con Proxy (Recomendado)

```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar servidor de desarrollo
npm start

# 2. Acceder a la aplicación
# http://localhost:3000 (o el puerto configurado en .env)
```

### Opción 2: Servidor HTTP Simple

```bash
# 1. Servir archivos estáticos
npx serve . -s -l 8080
# o
python -m http.server 8080

# 2. Acceder a la aplicación
# http://localhost:8080
```

### Opción 3: Live Server (VS Code)

1. Instalar extensión "Live Server"
2. Clic derecho en `index.html`
3. Seleccionar "Open with Live Server"

## 📡 Endpoints de API Implementados

### Autenticación
- `POST /api/iam/login` - Iniciar sesión
- `POST /api/iam/registro` - Registrar usuario
- `POST /api/iam/refresh` - Renovar token

### Libros
- `GET /api/books` - Obtener libros del usuario
- `POST /api/books` - Crear nuevo libro
- `PUT /api/books/{id}` - Actualizar libro
- `DELETE /api/books/{id}` - Eliminar libro

## 🔒 Manejo de Autenticación

### Flujo de Autenticación
1. Usuario ingresa credenciales
2. API valida y retorna JWT + Refresh Token
3. Frontend almacena tokens en `localStorage`
4. Todas las requests incluyen `Authorization: Bearer <token>`
5. Si token expira, se renueva automáticamente
6. Si refresh falla, se redirige al login

### Estructura del JWT
```javascript
{
  "userId": 123,
  "email": "usuario@example.com",
  "exp": 1234567890
}
```

## 🎯 Navegación

### Rutas Disponibles
- `#/login` - Página de login/registro
- `#/dashboard` - Página principal
- `#/books` - Gestión de libros

### Protección de Rutas
- **Rutas públicas**: `#/login`
- **Rutas protegidas**: `#/dashboard`, `#/books`
- **Redirecciones automáticas** según estado de autenticación

## 🎨 Componentes de UI

### Layout System
```javascript
// Layout principal con navegación
createLayout(content)

// Notificaciones
showNotification(message, type)

// Estados de carga
showLoading()
```

### Formularios
- **Validación** en tiempo real
- **Estados de carga** durante submit
- **Manejo de errores** de API
- **Campos requeridos**

## 🔧 Servicios

### AuthService
```javascript
// Autenticación
await authService.login({email, password})
await authService.register({nombre, email, password})
await authService.refreshToken()

// Gestión de tokens
authService.setToken(token)
authService.getToken()
authService.isAuthenticated()
authService.getCurrentUser()
authService.logout()
```

### ApiService
```javascript
// Libros
await apiService.getBooks()
await apiService.createBook({nombre, descripcion})
await apiService.updateBook(id, {nombre, descripcion})
await apiService.deleteBook(id)

// Request con auto-refresh
await apiService.request('/endpoint', options)
```

## 🚨 Manejo de Errores

### Errores de API
- **401 Unauthorized**: Auto-refresh de token
- **403 Forbidden**: Credenciales inválidas
- **404 Not Found**: Recurso no encontrado
- **422 Unprocessable Entity**: Datos inválidos
- **500 Internal Server Error**: Error del servidor

### Errores de Red
- **CORS**: Configurado con proxy
- **Timeout**: Manejo de requests lentos
- **Offline**: Detección de conexión

### Notificaciones de Error
```javascript
// Tipos de mensaje
showNotification('Éxito', 'success')  // Verde
showNotification('Error', 'error')    // Rojo
showNotification('Info', 'info')      // Azul
```

## 📱 Diseño Responsive

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Componentes Adaptativos
- **Navegación**: Hamburger menu en mobile
- **Grillas**: Responsive grid system
- **Formularios**: Stack vertical en mobile
- **Botones**: Full width en mobile

## 🔄 Estados de la Aplicación

### Estados de Autenticación
- **No autenticado**: Mostrar login
- **Autenticado**: Acceso a dashboard
- **Token expirado**: Auto-refresh
- **Refresh fallido**: Logout automático

### Estados de Datos
- **Cargando**: Spinner de carga
- **Vacío**: Mensaje de no hay datos
- **Error**: Mensaje de error con reintentar
- **Éxito**: Datos mostrados correctamente

## 🎯 Próximas Funcionalidades

### Pendientes (No implementadas en API)
- [ ] Gestión de usuarios (CRUD)
- [ ] Sistema de privilegios
- [ ] Administración de roles
- [ ] Configuración de perfil

### Mejoras Futuras
- [ ] Paginación de libros
- [ ] Búsqueda y filtros
- [ ] Ordenamiento de columnas
- [ ] Exportación de datos
- [ ] Modo oscuro
- [ ] PWA con Service Worker
- [ ] Tests automatizados

## 📊 Compatibilidad

### Navegadores Soportados
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

### Tecnologías Utilizadas
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Styling**: Tailwind CSS
- **API**: REST con JSON
- **Autenticación**: JWT + Refresh Token
- **Desarrollo**: Node.js + Express (proxy)

## 🚀 Despliegue

### Desarrollo
```bash
npm start              # Servidor con proxy
npm run dev           # Modo desarrollo con nodemon
```

### Producción
```bash
npm run build         # (Futuro) Build para producción
npm run serve         # Servidor estático
```

## 📝 Licencia

Este proyecto es para fines educativos y de demostración.

---

## 🎉 ¡Listo para usar!

La aplicación está completamente funcional y conectada a la API real. Puedes:

1. **Registrar** nuevos usuarios
2. **Iniciar sesión** con credenciales válidas
3. **Crear, editar y eliminar** libros
4. **Navegar** entre páginas sin recargar
5. **Mantener sesión** con refresh automático

**¡Disfruta explorando el sistema!** 🚀