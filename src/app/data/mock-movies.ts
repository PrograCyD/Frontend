import { MovieExtended } from '../models/movie.model';

/**
 * Mock Movies Data
 * Datos de prueba para desarrollo del frontend
 * Adaptado a la estructura del backend (internal/models/movie.go)
 */

export const mockMovies: MovieExtended[] = [
  {
    movieId: 1,
    title: "Horizonte Oscuro",
    year: 2024,
    genres: ["Acción", "Thriller", "Ciencia Ficción"],
    links: {
      tmdb: "12345",
      imdb: "tt1234567",
      movielens: "1"
    },
    genomeTags: [
      { tag: "dystopian future", relevance: 0.95 },
      { tag: "espionage", relevance: 0.88 },
      { tag: "conspiracy", relevance: 0.82 }
    ],
    userTags: ["must watch", "amazing visuals", "plot twist", "intense"],
    ratingStats: {
      average: 4.4,
      count: 2543,
      lastRatedAt: "2024-11-28T10:30:00Z"
    },
    externalData: {
      posterUrl: "https://images.unsplash.com/photo-1762356121454-877acbd554bb?w=500",
      overview: "Cuando un ex agente secreto debe volver a la acción para salvar el mundo de una amenaza inminente, descubre que la conspiración es mucho más profunda de lo que imaginaba.",
      cast: [
        { name: "Marcus Chen", profileUrl: "https://example.com/marcus-chen" },
        { name: "Elena Rodriguez", profileUrl: "https://example.com/elena-rodriguez" },
        { name: "David Thompson" },
        { name: "Sofia Martinez" }
      ],
      director: "Christopher Morrison",
      runtime: 142,
      budget: 150000000,
      revenue: 450000000,
      tmdbFetched: true
    },
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-11-28T10:30:00Z",
    // UI helpers
    posterPath: "https://images.unsplash.com/photo-1762356121454-877acbd554bb?w=500",
    backdropPath: "https://images.unsplash.com/photo-1762356121454-877acbd554bb?w=1920",
    overview: "Cuando un ex agente secreto debe volver a la acción para salvar el mundo de una amenaza inminente, descubre que la conspiración es mucho más profunda de lo que imaginaba.",
    cast: ["Marcus Chen", "Elena Rodriguez", "David Thompson", "Sofia Martinez"],
    director: "Christopher Morrison",
    runtime: 142,
    budget: 150000000,
    revenue: 450000000,
    averageRating: 4.4,
    voteCount: 2543,
    popularity: 95.5,
    releaseDate: "2024-03-15"
  },
  {
    movieId: 2,
    title: "Ecos del Pasado",
    year: 2024,
    genres: ["Drama", "Romance", "Histórico"],
    links: {
      tmdb: "12346",
      imdb: "tt1234568",
      movielens: "2"
    },
    genomeTags: [
      { tag: "period piece", relevance: 0.92 },
      { tag: "love story", relevance: 0.89 },
      { tag: "war aftermath", relevance: 0.85 }
    ],
    userTags: ["emotional", "beautiful", "must see", "masterpiece"],
    ratingStats: {
      average: 4.6,
      count: 3821,
      lastRatedAt: "2024-11-27T15:20:00Z"
    },
    externalData: {
      posterUrl: "https://images.unsplash.com/photo-1572627343628-b45e6e499dcd?w=500",
      overview: "En la Francia de posguerra, dos almas perdidas encuentran consuelo el uno en el otro mientras luchan con los fantasmas de su pasado.",
      cast: [
        { name: "Isabella Laurent" },
        { name: "Pierre Beaumont" },
        { name: "Claire Anderson" }
      ],
      director: "Amélie Rousseau",
      runtime: 128,
      budget: 45000000,
      revenue: 125000000,
      tmdbFetched: true
    },
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-11-27T15:20:00Z",
    // UI helpers
    posterPath: "https://images.unsplash.com/photo-1572627343628-b45e6e499dcd?w=500",
    backdropPath: "https://images.unsplash.com/photo-1572627343628-b45e6e499dcd?w=1920",
    overview: "En la Francia de posguerra, dos almas perdidas encuentran consuelo el uno en el otro mientras luchan con los fantasmas de su pasado.",
    cast: ["Isabella Laurent", "Pierre Beaumont", "Claire Anderson"],
    director: "Amélie Rousseau",
    runtime: 128,
    budget: 45000000,
    revenue: 125000000,
    averageRating: 4.6,
    voteCount: 3821,
    popularity: 88.3,
    releaseDate: "2024-05-20"
  },
  {
    movieId: 3,
    title: "Risas sin Control",
    year: 2024,
    genres: ["Comedia", "Aventura"],
    links: {
      tmdb: "12347",
      imdb: "tt1234569",
      movielens: "3"
    },
    genomeTags: [
      { tag: "road trip", relevance: 0.91 },
      { tag: "friendship", relevance: 0.87 },
      { tag: "slapstick", relevance: 0.79 }
    ],
    userTags: ["funny", "entertaining", "feel good movie", "family movie"],
    ratingStats: {
      average: 4.0,
      count: 1923,
      lastRatedAt: "2024-11-26T12:00:00Z"
    },
    externalData: {
      posterUrl: "https://images.unsplash.com/photo-1572700432881-42c60fe8c869?w=500",
      overview: "Un grupo de amigos desafortunados se embarca en un viaje por carretera que rápidamente se convierte en una serie de desventuras hilarantes.",
      cast: [
        { name: "Tommy Williams" },
        { name: "Jessica Park" },
        { name: "Mike Johnson" }
      ],
      director: "Sarah Mitchell",
      runtime: 98,
      budget: 35000000,
      revenue: 95000000,
      tmdbFetched: true
    },
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-11-26T12:00:00Z",
    // UI helpers
    posterPath: "https://images.unsplash.com/photo-1572700432881-42c60fe8c869?w=500",
    backdropPath: "https://images.unsplash.com/photo-1572700432881-42c60fe8c869?w=1920",
    overview: "Un grupo de amigos desafortunados se embarca en un viaje por carretera que rápidamente se convierte en una serie de desventuras hilarantes.",
    cast: ["Tommy Williams", "Jessica Park", "Mike Johnson"],
    director: "Sarah Mitchell",
    runtime: 98,
    budget: 35000000,
    revenue: 95000000,
    averageRating: 4.0,
    voteCount: 1923,
    popularity: 76.8,
    releaseDate: "2024-07-10"
  },
  {
    movieId: 4,
    title: "Dimensión Perdida",
    year: 2024,
    genres: ["Ciencia Ficción", "Aventura"],
    links: {
      tmdb: "12348",
      imdb: "tt1234570",
      movielens: "4"
    },
    genomeTags: [
      { tag: "parallel universe", relevance: 0.94 },
      { tag: "quantum physics", relevance: 0.86 },
      { tag: "existential", relevance: 0.81 }
    ],
    userTags: ["mind-bending", "sci-fi", "visually stunning", "thought-provoking"],
    ratingStats: {
      average: 4.2,
      count: 2156,
      lastRatedAt: "2024-11-25T18:45:00Z"
    },
    externalData: {
      posterUrl: "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=500",
      overview: "Un científico descubre un portal a otra dimensión, pero lo que encuentra allí cambiará su comprensión de la realidad para siempre.",
      cast: [
        { name: "Robert Hayes" },
        { name: "Maya Patel" },
        { name: "James Cooper" }
      ],
      director: "Alex Turner",
      runtime: 136,
      budget: 85000000,
      revenue: 210000000,
      tmdbFetched: true
    },
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-11-25T18:45:00Z",
    // UI helpers
    posterPath: "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=500",
    backdropPath: "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=1920",
    overview: "Un científico descubre un portal a otra dimensión, pero lo que encuentra allí cambiará su comprensión de la realidad para siempre.",
    cast: ["Robert Hayes", "Maya Patel", "James Cooper"],
    director: "Alex Turner",
    runtime: 136,
    budget: 85000000,
    revenue: 210000000,
    averageRating: 4.2,
    voteCount: 2156,
    popularity: 82.1,
    releaseDate: "2024-08-22"
  },
  {
    movieId: 5,
    title: "Sombras de Medianoche",
    year: 2024,
    genres: ["Terror", "Thriller"],
    links: {
      tmdb: "12349",
      imdb: "tt1234571",
      movielens: "5"
    },
    genomeTags: [
      { tag: "haunted house", relevance: 0.96 },
      { tag: "paranormal", relevance: 0.90 },
      { tag: "family secrets", relevance: 0.84 }
    ],
    userTags: ["scary", "atmospheric", "suspenseful", "horror"],
    ratingStats: {
      average: 4.3,
      count: 2891,
      lastRatedAt: "2024-11-24T22:30:00Z"
    },
    externalData: {
      posterUrl: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=500",
      overview: "En una casa antigua, una familia comienza a experimentar eventos paranormales que revelan un oscuro secreto del pasado.",
      cast: [
        { name: "Emma Wilson" },
        { name: "Daniel Lee" },
        { name: "Sarah Brown" }
      ],
      director: "Michael Zhang",
      runtime: 112,
      budget: 25000000,
      revenue: 135000000,
      tmdbFetched: true
    },
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-11-24T22:30:00Z",
    // UI helpers
    posterPath: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=500",
    backdropPath: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=1920",
    overview: "En una casa antigua, una familia comienza a experimentar eventos paranormales que revelan un oscuro secreto del pasado.",
    cast: ["Emma Wilson", "Daniel Lee", "Sarah Brown"],
    director: "Michael Zhang",
    runtime: 112,
    budget: 25000000,
    revenue: 135000000,
    averageRating: 4.3,
    voteCount: 2891,
    popularity: 91.2,
    releaseDate: "2024-10-31"
  },
  {
    movieId: 6,
    title: "El Último Guardián",
    year: 2024,
    genres: ["Fantasía", "Aventura", "Acción"],
    links: {
      tmdb: "12350",
      imdb: "tt1234572",
      movielens: "6"
    },
    genomeTags: [
      { tag: "chosen one", relevance: 0.93 },
      { tag: "magic", relevance: 0.91 },
      { tag: "good vs evil", relevance: 0.88 }
    ],
    userTags: ["epic", "fantasy", "adventure", "amazing visuals"],
    ratingStats: {
      average: 4.5,
      count: 4123,
      lastRatedAt: "2024-11-23T16:00:00Z"
    },
    externalData: {
      posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500",
      overview: "Un joven guerrero debe proteger el último cristal de poder antes de que caiga en manos de un antiguo mal que amenaza con destruir su mundo.",
      cast: [
        { name: "Chris Anderson" },
        { name: "Luna Kim" },
        { name: "Viktor Petrov" }
      ],
      director: "Jennifer Stone",
      runtime: 155,
      budget: 200000000,
      revenue: 850000000,
      tmdbFetched: true
    },
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-11-23T16:00:00Z",
    // UI helpers
    posterPath: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500",
    backdropPath: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920",
    overview: "Un joven guerrero debe proteger el último cristal de poder antes de que caiga en manos de un antiguo mal que amenaza con destruir su mundo.",
    cast: ["Chris Anderson", "Luna Kim", "Viktor Petrov"],
    director: "Jennifer Stone",
    runtime: 155,
    budget: 200000000,
    revenue: 850000000,
    averageRating: 4.5,
    voteCount: 4123,
    popularity: 97.8,
    releaseDate: "2024-12-15"
  },
  {
    movieId: 7,
    title: "Código Rojo",
    year: 2024,
    genres: ["Acción", "Crimen"],
    links: {
      tmdb: "12351",
      imdb: "tt1234573",
      movielens: "7"
    },
    genomeTags: [
      { tag: "heist", relevance: 0.90 },
      { tag: "cat and mouse", relevance: 0.86 },
      { tag: "detective", relevance: 0.83 }
    ],
    userTags: ["action-packed", "thrilling", "crime", "intense"],
    ratingStats: {
      average: 4.1,
      count: 1876,
      lastRatedAt: "2024-11-22T14:15:00Z"
    },
    externalData: {
      posterUrl: "https://images.unsplash.com/photo-1574267432644-f610c34b3ab0?w=500",
      overview: "Un detective experimentado debe detener a un genio del crimen antes de que ejecute el mayor atraco de la historia.",
      cast: [
        { name: "Jack Morrison" },
        { name: "Nina Reyes" },
        { name: "Tom Bradley" }
      ],
      director: "David Chen",
      runtime: 118,
      budget: 65000000,
      revenue: 185000000,
      tmdbFetched: true
    },
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-11-22T14:15:00Z",
    // UI helpers
    posterPath: "https://images.unsplash.com/photo-1574267432644-f610c34b3ab0?w=500",
    backdropPath: "https://images.unsplash.com/photo-1574267432644-f610c34b3ab0?w=1920",
    overview: "Un detective experimentado debe detener a un genio del crimen antes de que ejecute el mayor atraco de la historia.",
    cast: ["Jack Morrison", "Nina Reyes", "Tom Bradley"],
    director: "David Chen",
    runtime: 118,
    budget: 65000000,
    revenue: 185000000,
    averageRating: 4.1,
    voteCount: 1876,
    popularity: 79.5,
    releaseDate: "2024-02-28"
  },
  {
    movieId: 8,
    title: "Primavera en París",
    year: 2024,
    genres: ["Romance", "Comedia"],
    links: {
      tmdb: "12352",
      imdb: "tt1234574",
      movielens: "8"
    },
    genomeTags: [
      { tag: "meet-cute", relevance: 0.89 },
      { tag: "romance", relevance: 0.94 },
      { tag: "european charm", relevance: 0.87 }
    ],
    userTags: ["romantic", "charming", "paris", "feel-good"],
    ratingStats: {
      average: 4.4,
      count: 3245,
      lastRatedAt: "2024-11-21T11:30:00Z"
    },
    externalData: {
      posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500",
      overview: "Dos extraños se encuentran en París y comparten una noche mágica que cambiará sus vidas para siempre.",
      cast: [
        { name: "Sophie Dubois" },
        { name: "Marco Rossi" },
        { name: "Alice Martin" }
      ],
      director: "François Laurent",
      runtime: 106,
      budget: 18000000,
      revenue: 72000000,
      tmdbFetched: true
    },
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-11-21T11:30:00Z",
    // UI helpers
    posterPath: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500",
    backdropPath: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920",
    overview: "Dos extraños se encuentran en París y comparten una noche mágica que cambiará sus vidas para siempre.",
    cast: ["Sophie Dubois", "Marco Rossi", "Alice Martin"],
    director: "François Laurent",
    runtime: 106,
    budget: 18000000,
    revenue: 72000000,
    averageRating: 4.4,
    voteCount: 3245,
    popularity: 85.7,
    releaseDate: "2024-04-14"
  },
  {
    movieId: 9,
    title: "Profundidades Abisales",
    year: 2024,
    genres: ["Terror", "Ciencia Ficción"],
    links: {
      tmdb: "12353",
      imdb: "tt1234575",
      movielens: "9"
    },
    genomeTags: [
      { tag: "deep sea", relevance: 0.93 },
      { tag: "monster", relevance: 0.89 },
      { tag: "survival", relevance: 0.85 }
    ],
    userTags: ["scary", "underwater", "creature feature", "tense"],
    ratingStats: {
      average: 4.2,
      count: 2367,
      lastRatedAt: "2024-11-20T09:45:00Z"
    },
    externalData: {
      posterUrl: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=500",
      overview: "Una expedición submarina descubre algo aterrador en las profundidades del océano que nunca debió ser despertado.",
      cast: [
        { name: "Rachel Green" },
        { name: "Paul Anderson" },
        { name: "Kim Li" }
      ],
      director: "Steven Park",
      runtime: 124,
      budget: 55000000,
      revenue: 165000000,
      tmdbFetched: true
    },
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-11-20T09:45:00Z",
    // UI helpers
    posterPath: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=500",
    backdropPath: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=1920",
    overview: "Una expedición submarina descubre algo aterrador en las profundidades del océano que nunca debió ser despertado.",
    cast: ["Rachel Green", "Paul Anderson", "Kim Li"],
    director: "Steven Park",
    runtime: 124,
    budget: 55000000,
    revenue: 165000000,
    averageRating: 4.2,
    voteCount: 2367,
    popularity: 83.4,
    releaseDate: "2024-06-07"
  },
  {
    movieId: 10,
    title: "Caminos Cruzados",
    year: 2024,
    genres: ["Drama", "Independiente"],
    links: {
      tmdb: "12354",
      imdb: "tt1234576",
      movielens: "10"
    },
    genomeTags: [
      { tag: "interconnected stories", relevance: 0.91 },
      { tag: "life choices", relevance: 0.88 },
      { tag: "drama", relevance: 0.95 }
    ],
    userTags: ["powerful", "indie", "thought-provoking", "award-worthy"],
    ratingStats: {
      average: 4.7,
      count: 1567,
      lastRatedAt: "2024-11-19T17:00:00Z"
    },
    externalData: {
      posterUrl: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=500",
      overview: "Tres historias se entrelazan en una narrativa poderosa sobre las decisiones que cambian nuestras vidas.",
      cast: [
        { name: "Laura Martinez" },
        { name: "John Smith" },
        { name: "Ana Garcia" }
      ],
      director: "Carlos Mendoza",
      runtime: 142,
      budget: 8000000,
      revenue: 32000000,
      tmdbFetched: true
    },
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-11-19T17:00:00Z",
    // UI helpers
    posterPath: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=500",
    backdropPath: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=1920",
    overview: "Tres historias se entrelazan en una narrativa poderosa sobre las decisiones que cambian nuestras vidas.",
    cast: ["Laura Martinez", "John Smith", "Ana Garcia"],
    director: "Carlos Mendoza",
    runtime: 142,
    budget: 8000000,
    revenue: 32000000,
    averageRating: 4.7,
    voteCount: 1567,
    popularity: 72.3,
    releaseDate: "2024-09-18"
  },
  {
    movieId: 11,
    title: "Velocidad Máxima",
    year: 2024,
    genres: ["Acción", "Deportes"],
    links: {
      tmdb: "12355",
      imdb: "tt1234577",
      movielens: "11"
    },
    genomeTags: [
      { tag: "car racing", relevance: 0.96 },
      { tag: "redemption", relevance: 0.84 },
      { tag: "rivalry", relevance: 0.87 }
    ],
    userTags: ["racing", "adrenaline", "sports", "competitive"],
    ratingStats: {
      average: 4.0,
      count: 2134,
      lastRatedAt: "2024-11-18T13:20:00Z"
    },
    externalData: {
      posterUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500",
      overview: "Un piloto de carreras retirado debe volver a las pistas para salvar su legado y enfrentar a su viejo rival.",
      cast: [
        { name: "Ryan Cooper" },
        { name: "Maria Santos" },
        { name: "Alex Turner" }
      ],
      director: "Tony Stark",
      runtime: 115,
      budget: 42000000,
      revenue: 118000000,
      tmdbFetched: true
    },
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-11-18T13:20:00Z",
    // UI helpers
    posterPath: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500",
    backdropPath: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920",
    overview: "Un piloto de carreras retirado debe volver a las pistas para salvar su legado y enfrentar a su viejo rival.",
    cast: ["Ryan Cooper", "Maria Santos", "Alex Turner"],
    director: "Tony Stark",
    runtime: 115,
    budget: 42000000,
    revenue: 118000000,
    averageRating: 4.0,
    voteCount: 2134,
    popularity: 77.9,
    releaseDate: "2024-11-03"
  },
  {
    movieId: 12,
    title: "La Casa del Lago",
    year: 2024,
    genres: ["Misterio", "Thriller"],
    links: {
      tmdb: "12356",
      imdb: "tt1234578",
      movielens: "12"
    },
    genomeTags: [
      { tag: "psychological thriller", relevance: 0.92 },
      { tag: "isolation", relevance: 0.88 },
      { tag: "mystery", relevance: 0.90 }
    ],
    userTags: ["mysterious", "atmospheric", "suspenseful", "twists"],
    ratingStats: {
      average: 4.3,
      count: 1998,
      lastRatedAt: "2024-11-17T08:30:00Z"
    },
    externalData: {
      posterUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
      overview: "Una escritora se retira a una casa junto al lago para terminar su novela, pero comienza a experimentar eventos inexplicables.",
      cast: [
        { name: "Katherine White" },
        { name: "Benjamin Gray" },
        { name: "Olivia Moore" }
      ],
      director: "Rebecca Johnson",
      runtime: 108,
      budget: 22000000,
      revenue: 68000000,
      tmdbFetched: true
    },
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-11-17T08:30:00Z",
    // UI helpers
    posterPath: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
    backdropPath: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920",
    overview: "Una escritora se retira a una casa junto al lago para terminar su novela, pero comienza a experimentar eventos inexplicables.",
    cast: ["Katherine White", "Benjamin Gray", "Olivia Moore"],
    director: "Rebecca Johnson",
    runtime: 108,
    budget: 22000000,
    revenue: 68000000,
    averageRating: 4.3,
    voteCount: 1998,
    popularity: 81.2,
    releaseDate: "2024-01-25"
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
