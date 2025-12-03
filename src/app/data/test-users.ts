/**
 * 🧪 USUARIOS DE PRUEBA - Frontend Testing
 *
 * Estos usuarios están configurados en el AuthService (modo MOCK)
 * Para probar el login, usa cualquiera de estas credenciales:
 */

export interface TestUser {
  email: string;
  password: string;
  role: 'admin' | 'user';
  description: string;
}

export const TEST_USERS: TestUser[] = [
  {
    email: 'admin@movies.com',
    password: 'admin123',
    role: 'admin',
    description: '👑 Administrador - Acceso completo al panel admin'
  },
  {
    email: 'user@movies.com',
    password: 'user123',
    role: 'user',
    description: '👤 Usuario regular - Perfil básico con estadísticas'
  },
  {
    email: 'john.doe@movies.com',
    password: 'password123',
    role: 'user',
    description: '👤 John Doe - Usuario de prueba #1'
  },
  {
    email: 'jane.smith@movies.com',
    password: 'password123',
    role: 'user',
    description: '👤 Jane Smith - Usuario de prueba #2'
  }
];

/**
 * 📝 NOTAS DE DESARROLLO:
 *
 * 1. MODO MOCK ACTIVO:
 *    - Los datos NO se conectan al backend
 *    - Las películas vienen de mock-movies.ts
 *    - Los usuarios vienen de auth.service.ts (mockUsers)
 *
 * 2. FUNCIONALIDADES MOCK:
 *    ✅ Login/Register
 *    ✅ Navegación completa
 *    ✅ Listado de películas
 *    ✅ Detalles de películas
 *    ✅ Filtros y búsqueda
 *    ✅ Perfil de usuario con estadísticas
 *    ✅ Cambio de rating (visual solamente)
 *
 * 3. PENDIENTE BACKEND:
 *    ⏳ Guardar ratings reales
 *    ⏳ Recomendaciones personalizadas
 *    ⏳ Sistema de caché con Redis
 *    ⏳ WebSocket para recomendaciones en tiempo real
 *    ⏳ Panel admin con gestión real
 *
 * 4. PARA ACTIVAR BACKEND:
 *    - Cambiar environment.mockData = false
 *    - Descomentar llamadas API en servicios
 *    - Configurar environment.apiUrl correcto
 */

// Helper para imprimir credenciales en consola
export function logTestCredentials(): void {
  console.log('\n🧪 ===== CREDENCIALES DE PRUEBA =====\n');
  TEST_USERS.forEach(user => {
    console.log(`${user.description}`);
    console.log(`   📧 Email: ${user.email}`);
    console.log(`   🔐 Password: ${user.password}`);
    console.log('');
  });
  console.log('=====================================\n');
}
