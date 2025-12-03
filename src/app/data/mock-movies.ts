import { MovieExtended } from '../models/movie.model';

/**
 * Mock Movies Data
 * Datos de prueba para desarrollo del frontend
 * Adaptado desde FigmaMakeDemo
 */

export const mockMovies: MovieExtended[] = [
  {
    movieId: 1,
    title: "Horizonte Oscuro",
    genres: ["Acción", "Thriller", "Ciencia Ficción"],
    releaseDate: "2024-03-15",
    posterPath: "https://images.unsplash.com/photo-1762356121454-877acbd554bb?w=500",
    backdropPath: "https://images.unsplash.com/photo-1762356121454-877acbd554bb?w=1920",
    overview: "Cuando un ex agente secreto debe volver a la acción para salvar el mundo de una amenaza inminente, descubre que la conspiración es mucho más profunda de lo que imaginaba.",
    averageRating: 4.4,
    voteAverage: 4.4,
    voteCount: 2543,
    popularity: 95.5,
    runtime: 142,
    cast: ["Marcus Chen", "Elena Rodriguez", "David Thompson", "Sofia Martinez"],
    director: "Christopher Morrison",
    tags: ["must watch", "amazing visuals", "plot twist", "intense"],
    genomeTags: ["dystopian future", "espionage", "conspiracy"],
    userTags: ["must watch", "amazing visuals", "plot twist", "intense"],
    tmdbId: 12345,
    imdbId: "tt1234567",
    movieLensId: 1,
    budget: 150000000,
    revenue: 450000000
  },
  {
    movieId: 2,
    title: "Ecos del Pasado",
    genres: ["Drama", "Romance", "Histórico"],
    releaseDate: "2024-05-20",
    posterPath: "https://images.unsplash.com/photo-1572627343628-b45e6e499dcd?w=500",
    backdropPath: "https://images.unsplash.com/photo-1572627343628-b45e6e499dcd?w=1920",
    overview: "En la Francia de posguerra, dos almas perdidas encuentran consuelo el uno en el otro mientras luchan con los fantasmas de su pasado.",
    averageRating: 4.6,
    voteAverage: 4.6,
    voteCount: 3821,
    popularity: 88.3,
    runtime: 128,
    cast: ["Isabella Laurent", "Pierre Beaumont", "Claire Anderson"],
    director: "Amélie Rousseau",
    tags: ["emotional", "beautiful", "must see", "masterpiece"],
    genomeTags: ["period piece", "love story", "war aftermath"],
    userTags: ["emotional", "beautiful", "must see", "masterpiece"],
    tmdbId: 12346,
    imdbId: "tt1234568",
    movieLensId: 2,
    budget: 45000000,
    revenue: 125000000
  },
  {
    movieId: 3,
    title: "Risas sin Control",
    genres: ["Comedia", "Aventura"],
    releaseDate: "2024-07-10",
    posterPath: "https://images.unsplash.com/photo-1572700432881-42c60fe8c869?w=500",
    backdropPath: "https://images.unsplash.com/photo-1572700432881-42c60fe8c869?w=1920",
    overview: "Un grupo de amigos desafortunados se embarca en un viaje por carretera que rápidamente se convierte en una serie de desventuras hilarantes.",
    averageRating: 4.0,
    voteAverage: 4.0,
    voteCount: 1923,
    popularity: 76.8,
    runtime: 98,
    cast: ["Tommy Williams", "Jessica Park", "Mike Johnson"],
    director: "Sarah Mitchell",
    tags: ["funny", "entertaining", "feel good movie", "family movie"],
    genomeTags: ["road trip", "friendship", "slapstick"],
    userTags: ["funny", "entertaining", "feel good movie", "family movie"],
    tmdbId: 12347,
    imdbId: "tt1234569",
    movieLensId: 3,
    budget: 35000000,
    revenue: 95000000
  },
  {
    movieId: 4,
    title: "Dimensión Perdida",
    genres: ["Ciencia Ficción", "Aventura"],
    releaseDate: "2024-08-22",
    posterPath: "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=500",
    backdropPath: "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=1920",
    overview: "Un científico descubre un portal a otra dimensión, pero lo que encuentra allí cambiará su comprensión de la realidad para siempre.",
    averageRating: 4.2,
    voteAverage: 4.2,
    voteCount: 2156,
    popularity: 82.1,
    runtime: 136,
    cast: ["Robert Hayes", "Maya Patel", "James Cooper"],
    director: "Alex Turner",
    tags: ["mind-bending", "sci-fi", "visually stunning", "thought-provoking"],
    genomeTags: ["parallel universe", "quantum physics", "existential"],
    userTags: ["mind-bending", "sci-fi", "visually stunning", "thought-provoking"],
    tmdbId: 12348,
    imdbId: "tt1234570",
    movieLensId: 4,
    budget: 85000000,
    revenue: 210000000
  },
  {
    movieId: 5,
    title: "Sombras de Medianoche",
    genres: ["Terror", "Thriller"],
    releaseDate: "2024-10-31",
    posterPath: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=500",
    backdropPath: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=1920",
    overview: "En una casa antigua, una familia comienza a experimentar eventos paranormales que revelan un oscuro secreto del pasado.",
    averageRating: 4.3,
    voteAverage: 4.3,
    voteCount: 2891,
    popularity: 91.2,
    runtime: 112,
    cast: ["Emma Wilson", "Daniel Lee", "Sarah Brown"],
    director: "Michael Zhang",
    tags: ["scary", "atmospheric", "suspenseful", "horror"],
    genomeTags: ["haunted house", "paranormal", "family secrets"],
    userTags: ["scary", "atmospheric", "suspenseful", "horror"],
    tmdbId: 12349,
    imdbId: "tt1234571",
    movieLensId: 5,
    budget: 25000000,
    revenue: 135000000
  },
  {
    movieId: 6,
    title: "El Último Guardián",
    genres: ["Fantasía", "Aventura", "Acción"],
    releaseDate: "2024-12-15",
    posterPath: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500",
    backdropPath: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920",
    overview: "Un joven guerrero debe proteger el último cristal de poder antes de que caiga en manos de un antiguo mal que amenaza con destruir su mundo.",
    averageRating: 4.5,
    voteAverage: 4.5,
    voteCount: 4123,
    popularity: 97.8,
    runtime: 155,
    cast: ["Chris Anderson", "Luna Kim", "Viktor Petrov"],
    director: "Jennifer Stone",
    tags: ["epic", "fantasy", "adventure", "amazing visuals"],
    genomeTags: ["chosen one", "magic", "good vs evil"],
    userTags: ["epic", "fantasy", "adventure", "amazing visuals"],
    tmdbId: 12350,
    imdbId: "tt1234572",
    movieLensId: 6,
    budget: 200000000,
    revenue: 850000000
  },
  {
    movieId: 7,
    title: "Código Rojo",
    genres: ["Acción", "Crimen"],
    releaseDate: "2024-02-28",
    posterPath: "https://images.unsplash.com/photo-1574267432644-f610c34b3ab0?w=500",
    backdropPath: "https://images.unsplash.com/photo-1574267432644-f610c34b3ab0?w=1920",
    overview: "Un detective experimentado debe detener a un genio del crimen antes de que ejecute el mayor atraco de la historia.",
    averageRating: 4.1,
    voteAverage: 4.1,
    voteCount: 1876,
    popularity: 79.5,
    runtime: 118,
    cast: ["Jack Morrison", "Nina Reyes", "Tom Bradley"],
    director: "David Chen",
    tags: ["action-packed", "thrilling", "crime", "intense"],
    genomeTags: ["heist", "cat and mouse", "detective"],
    userTags: ["action-packed", "thrilling", "crime", "intense"],
    tmdbId: 12351,
    imdbId: "tt1234573",
    movieLensId: 7,
    budget: 65000000,
    revenue: 185000000
  },
  {
    movieId: 8,
    title: "Primavera en París",
    genres: ["Romance", "Comedia"],
    releaseDate: "2024-04-14",
    posterPath: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500",
    backdropPath: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920",
    overview: "Dos extraños se encuentran en París y comparten una noche mágica que cambiará sus vidas para siempre.",
    averageRating: 4.4,
    voteAverage: 4.4,
    voteCount: 3245,
    popularity: 85.7,
    runtime: 106,
    cast: ["Sophie Dubois", "Marco Rossi", "Alice Martin"],
    director: "François Laurent",
    tags: ["romantic", "charming", "paris", "feel-good"],
    genomeTags: ["meet-cute", "romance", "european charm"],
    userTags: ["romantic", "charming", "paris", "feel-good"],
    tmdbId: 12352,
    imdbId: "tt1234574",
    movieLensId: 8,
    budget: 18000000,
    revenue: 72000000
  },
  {
    movieId: 9,
    title: "Profundidades Abisales",
    genres: ["Terror", "Ciencia Ficción"],
    releaseDate: "2024-06-07",
    posterPath: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=500",
    backdropPath: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=1920",
    overview: "Una expedición submarina descubre algo aterrador en las profundidades del océano que nunca debió ser despertado.",
    averageRating: 4.2,
    voteAverage: 4.2,
    voteCount: 2367,
    popularity: 83.4,
    runtime: 124,
    cast: ["Rachel Green", "Paul Anderson", "Kim Li"],
    director: "Steven Park",
    tags: ["scary", "underwater", "creature feature", "tense"],
    genomeTags: ["deep sea", "monster", "survival"],
    userTags: ["scary", "underwater", "creature feature", "tense"],
    tmdbId: 12353,
    imdbId: "tt1234575",
    movieLensId: 9,
    budget: 55000000,
    revenue: 165000000
  },
  {
    movieId: 10,
    title: "Caminos Cruzados",
    genres: ["Drama", "Independiente"],
    releaseDate: "2024-09-18",
    posterPath: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=500",
    backdropPath: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=1920",
    overview: "Tres historias se entrelazan en una narrativa poderosa sobre las decisiones que cambian nuestras vidas.",
    averageRating: 4.7,
    voteAverage: 4.7,
    voteCount: 1567,
    popularity: 72.3,
    runtime: 142,
    cast: ["Laura Martinez", "John Smith", "Ana Garcia"],
    director: "Carlos Mendoza",
    tags: ["powerful", "indie", "thought-provoking", "award-worthy"],
    genomeTags: ["interconnected stories", "life choices", "drama"],
    userTags: ["powerful", "indie", "thought-provoking", "award-worthy"],
    tmdbId: 12354,
    imdbId: "tt1234576",
    movieLensId: 10,
    budget: 8000000,
    revenue: 32000000
  },
  {
    movieId: 11,
    title: "Velocidad Máxima",
    genres: ["Acción", "Deportes"],
    releaseDate: "2024-11-03",
    posterPath: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500",
    backdropPath: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920",
    overview: "Un piloto de carreras retirado debe volver a las pistas para salvar su legado y enfrentar a su viejo rival.",
    averageRating: 4.0,
    voteAverage: 4.0,
    voteCount: 2134,
    popularity: 77.9,
    runtime: 115,
    cast: ["Ryan Cooper", "Maria Santos", "Alex Turner"],
    director: "Tony Stark",
    tags: ["racing", "adrenaline", "sports", "competitive"],
    genomeTags: ["car racing", "redemption", "rivalry"],
    userTags: ["racing", "adrenaline", "sports", "competitive"],
    tmdbId: 12355,
    imdbId: "tt1234577",
    movieLensId: 11,
    budget: 42000000,
    revenue: 118000000
  },
  {
    movieId: 12,
    title: "La Casa del Lago",
    genres: ["Misterio", "Thriller"],
    releaseDate: "2024-01-25",
    posterPath: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
    backdropPath: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920",
    overview: "Una escritora se retira a una casa junto al lago para terminar su novela, pero comienza a experimentar eventos inexplicables.",
    averageRating: 4.3,
    voteAverage: 4.3,
    voteCount: 1998,
    popularity: 81.2,
    runtime: 108,
    cast: ["Katherine White", "Benjamin Gray", "Olivia Moore"],
    director: "Rebecca Johnson",
    tags: ["mysterious", "atmospheric", "suspenseful", "twists"],
    genomeTags: ["psychological thriller", "isolation", "mystery"],
    userTags: ["mysterious", "atmospheric", "suspenseful", "twists"],
    tmdbId: 12356,
    imdbId: "tt1234578",
    movieLensId: 12,
    budget: 22000000,
    revenue: 68000000
  }
];

// Helper functions para filtrar películas
export const getTopRatedMovies = (limit: number = 10): MovieExtended[] => {
  return [...mockMovies]
    .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
    .slice(0, limit);
};

export const getMoviesByGenre = (genre: string, limit: number = 10): MovieExtended[] => {
  return mockMovies
    .filter(movie => movie.genres.includes(genre))
    .slice(0, limit);
};

export const getTrendingMovies = (limit: number = 10): MovieExtended[] => {
  return [...mockMovies]
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, limit);
};

export const getRecentMovies = (limit: number = 10): MovieExtended[] => {
  return [...mockMovies]
    .sort((a, b) => {
      const dateA = new Date(a.releaseDate || 0).getTime();
      const dateB = new Date(b.releaseDate || 0).getTime();
      return dateB - dateA;
    })
    .slice(0, limit);
};

export const getFeaturedMovie = (): MovieExtended => {
  return mockMovies[5]; // El Último Guardián - película con mejor rating y popularity
};
