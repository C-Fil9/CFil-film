const BASE_URL = 'https://phimapi.com';

export interface MovieItem {
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  poster_url: string;
  thumb_url: string;
  year: number;
}

export interface Pagination {
  totalItems: number;
  totalItemsPerPage: number;
  currentPage: number;
  totalPages: number;
}

export interface LatestMoviesResponse {
  status: boolean;
  items: MovieItem[];
  pagination: Pagination;
}

export interface CategoryResponse {
  status: string;
  data: {
    seoOnPage: Record<string, unknown>;
    breadCrumb: Record<string, unknown>[];
    titlePage: string;
    items: MovieItem[];
    params: {
      pagination: Pagination;
    };
    APP_DOMAIN_FRONTEND: string;
    APP_DOMAIN_CDN_IMAGE: string;
  };
}

export interface MovieDetail {
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  content: string;
  type: string;
  status: string;
  poster_url: string;
  thumb_url: string;
  is_copyright: boolean;
  sub_docquyen: boolean;
  chieurap: boolean;
  trailer_url: string;
  time: string;
  episode_current: string;
  episode_total: string;
  quality: string;
  lang: string;
  year: number;
  view: number;
  actor: string[];
  director: string[];
  category: { id: string; name: string; slug: string }[];
  country: { id: string; name: string; slug: string }[];
}

export interface Episode {
  server_name: string;
  server_data: {
    name: string;
    slug: string;
    filename: string;
    link_embed: string;
    link_m3u8: string;
  }[];
}

export interface MovieDetailResponse {
  status: boolean;
  msg: string;
  movie: MovieDetail;
  episodes: Episode[];
}

// 1. Lấy danh sách phim mới cập nhật
export const getLatestMovies = async (page: number = 1): Promise<LatestMoviesResponse> => {
  const res = await fetch(`${BASE_URL}/danh-sach/phim-moi-cap-nhat?page=${page}`);
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
};

// 2. Lấy danh sách phim theo thể loại (phim-le, phim-bo, hoat-hinh, tv-shows)
export const getMoviesByCategory = async (categorySlug: string, page: number = 1): Promise<CategoryResponse> => {
  const res = await fetch(`${BASE_URL}/v1/api/danh-sach/${categorySlug}?page=${page}`);
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
};

// 3. Chi tiết phim
export const getMovieDetails = async (slug: string): Promise<MovieDetailResponse> => {
  const res = await fetch(`${BASE_URL}/phim/${slug}`);
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
};

// 4. Tìm kiếm phim
export const searchMovies = async (keyword: string, limit: number = 24): Promise<CategoryResponse> => {
  const res = await fetch(`${BASE_URL}/v1/api/tim-kiem?keyword=${encodeURIComponent(keyword)}&limit=${limit}`);
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
};

// Hàm tiện ích để lấy URL ảnh tuyệt đối nếu cần
export const getImageUrl = (url: string, cdnDomain?: string) => {
  if (url.startsWith('http')) return url;
  if (cdnDomain) return `${cdnDomain}/${url}`;
  return `https://phimimg.com/${url}`; // default CDN
};
