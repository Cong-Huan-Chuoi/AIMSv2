export enum CategoryEnum {
    BOOK = 'Book',
    DVD = 'DVDs',
    CD = 'CDs',
    LP = 'LP'
}

export enum CoverTypeEnum {
    PAPERBACK = 'paperback',
    HARDCOVER = 'hardcover'
}

export enum DiscTypeEnum {
    BLURAY = 'blu_ray', 
    HDDVD = 'hd_dvd'    
}

export interface TrackInput {
    song_title: string;
    length: number;
}

// --- BASE INPUTS ---
export interface InputCreateBaseProduct {
    title: string;
    product_value: number;
    price: number;
    category: CategoryEnum;
    quantity: number;
    warehouse_entry_date: string;
    dimensions: string;
    barcode: number;
    description: string;
    weight: number;
    image_url?: string;
    vat?: number;
    support_rush_delivery?: boolean;
    genreIds?: string[];
}

export interface InputUpdateBaseProduct {
    id: string; // Bắt buộc khi update
    title?: string;
    product_value?: number;
    price?: number;
    category?: CategoryEnum;
    quantity?: number;
    warehouse_entry_date?: string;
    dimensions?: string;
    barcode?: number;
    description?: string;
    weight?: number;
    image_url?: string;
    vat?: number;
    support_rush_delivery?: boolean;
    genreIds?: string[];
}

// --- SPECIFIC CREATE INPUTS (KẾ THỪA BASE) ---
export interface InputCreateBook extends InputCreateBaseProduct {
    authors: string;
    cover_type: CoverTypeEnum;
    publisher: string;
    publish_date?: string;
    pages?: number;
    language?: string;
}

export interface InputCreateDVD extends InputCreateBaseProduct {
    disc_type: DiscTypeEnum;
    director: string;
    runtime: number;
    studio: string;
    language: string;
    subtitle: string;
    release_date?: string;
}

export interface InputCreateCD extends InputCreateBaseProduct {
    artist: string;
    record_label: string;
    track_count?: number;
    runtime?: number;
    release_date?: string;
    track?: TrackInput[];
}

export interface InputCreateLP extends InputCreateBaseProduct {
    artist: string;
    record_label: string;
    track_count?: number;
    runtime?: number;
    release_date?: string;
    track?: TrackInput[];
}

// --- SPECIFIC UPDATE INPUTS (KẾ THỪA BASE) ---
export interface InputUpdateBook extends InputUpdateBaseProduct {
    authors?: string;
    cover_type?: CoverTypeEnum;
    publisher?: string;
    publish_date?: string;
    pages?: number;
    language?: string;
}

export interface InputUpdateDVD extends InputUpdateBaseProduct {
    disc_type?: DiscTypeEnum;
    director?: string;
    runtime?: number;
    studio?: string;
    language?: string;
    subtitle?: string;
    release_date?: string;
}

export interface InputUpdateCD extends InputUpdateBaseProduct {
    artist?: string;
    record_label?: string;
    track_count?: number;
    runtime?: number;
    release_date?: string;
    track?: TrackInput[];
}

export interface InputUpdateLP extends InputUpdateBaseProduct {
    artist?: string;
    record_label?: string;
    track_count?: number;
    runtime?: number;
    release_date?: string;
    track?: TrackInput[];
}