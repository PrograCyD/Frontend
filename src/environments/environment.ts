export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  wsUrl: 'ws://localhost:8080',
  mockData: true, // Cambiar a false cuando el backend esté disponible
  jwtSecret: 'supersecret_jwt_para_pc4',
  cacheTimeout: 5 * 60 * 1000, // 5 minutos en milisegundos
};
