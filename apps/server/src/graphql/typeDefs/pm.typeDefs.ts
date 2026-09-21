export const pmTypeDefs = `#graphql
  enum CategoryEnum {
    Book
    DVDs
    CDs
    LP
  }

  enum CoverTypeEnum {
    paperback
    hardcover
  }

  enum DiscTypeEnum {
    blu_ray
    hd_dvd
  }

  type Genre {
    id: ID!
    name: String!
  }

  type Track {
    id: ID!
    song_title: String!
    length: Int!
  }

  type BookDetail {
    authors: String!
    cover_type: CoverTypeEnum!
    publisher: String!
    publish_date: String
    pages: Int
    language: String
  }

  type DVDDetail {
    disc_type: DiscTypeEnum!
    director: String!
    runtime: Int!
    studio: String!
    language: String!
    subtitle: String!
    release_date: String
  }

  type CDDetail {
    artist: String!
    record_label: String!
    track_count: Int
    runtime: Int
    release_date: String
    track: [Track!]
  }

  type LPDetail {
    artist: String!
    record_label: String!
    track_count: Int
    runtime: Int
    release_date: String
    track: [Track!]
  }

  # Product trả về giữ nguyên thiết kế gộp (Composition)
  type Product {
    id: ID!
    title: String
    product_value: Int
    price: Int
    category: CategoryEnum
    quantity: Int
    warehouse_entry_date: String
    dimensions: String
    barcode: Int
    image_url: String
    description: String
    weight: Int
    vat: Int
    support_rush_delivery: Boolean
    genres: [Genre!]
    book: BookDetail
    dvds: DVDDetail
    cds: CDDetail
    lp: LPDetail
  }

  input TrackInput {
    song_title: String!
    length: Int!
  }

  # ==========================================
  # INPUTS (Đã bóc tách riêng từng loại)
  # ==========================================

  input CreateBookInput {
    # --- Base Fields ---
    title: String!
    product_value: Int!
    price: Int!
    category: CategoryEnum!
    quantity: Int!
    warehouse_entry_date: String!
    dimensions: String!
    barcode: Int!
    image_url: String
    description: String!
    weight: Int!
    vat: Int
    support_rush_delivery: Boolean
    genreIds: [ID!]
    # --- Book Fields ---
    authors: String!
    cover_type: CoverTypeEnum!
    publisher: String!
    publish_date: String
    pages: Int
    language: String
  }

  input UpdateBookInput {
    # --- Base Fields (Tất cả optional trừ ID) ---
    id: ID!
    title: String
    product_value: Int
    price: Int
    category: CategoryEnum
    quantity: Int
    warehouse_entry_date: String
    dimensions: String
    barcode: Int
    image_url: String
    description: String
    weight: Int
    vat: Int
    support_rush_delivery: Boolean
    genreIds: [ID!]
    # --- Book Fields ---
    authors: String
    cover_type: CoverTypeEnum
    publisher: String
    publish_date: String
    pages: Int
    language: String
  }

  input CreateDVDInput {
    # --- Base Fields ---
    title: String!
    product_value: Int!
    price: Int!
    category: CategoryEnum!
    quantity: Int!
    warehouse_entry_date: String!
    dimensions: String!
    barcode: Int!
    image_url: String
    description: String!
    weight: Int!
    vat: Int
    support_rush_delivery: Boolean
    genreIds: [ID!]
    # --- DVD Fields ---
    disc_type: DiscTypeEnum!
    director: String!
    runtime: Int!
    studio: String!
    language: String!
    subtitle: String!
    release_date: String
  }

  input UpdateDVDInput {
    id: ID!
    title: String
    # ... (Các base fields optional tương tự UpdateBook) ...
    price: Int
    category: CategoryEnum
    # --- DVD Fields ---
    disc_type: DiscTypeEnum
    director: String
    runtime: Int
    studio: String
    language: String
    subtitle: String
    release_date: String
  }

  input CreateCDInput {
    title: String!, product_value: Int!, price: Int!, category: CategoryEnum!, quantity: Int!, warehouse_entry_date: String!, dimensions: String!, barcode: Int!, image_url: String, description: String!, weight: Int!, vat: Int, support_rush_delivery: Boolean, genreIds: [ID!]
    # --- CD Fields ---
    artist: String!
    record_label: String!
    track_count: Int
    runtime: Int
    release_date: String
    track: [TrackInput!]
  }

  input UpdateCDInput {
    id: ID!, title: String, price: Int, category: CategoryEnum
    # --- CD Fields ---
    artist: String
    record_label: String
    track_count: Int
    runtime: Int
    release_date: String
    track: [TrackInput!]
  }

  input CreateLPInput {
    title: String!, product_value: Int!, price: Int!, category: CategoryEnum!, quantity: Int!, warehouse_entry_date: String!, dimensions: String!, barcode: Int!, image_url: String, description: String!, weight: Int!, vat: Int, support_rush_delivery: Boolean, genreIds: [ID!]
    # --- LP Fields ---
    artist: String!
    record_label: String!
    track_count: Int
    runtime: Int
    release_date: String
    track: [TrackInput!]
  }

  input UpdateLPInput {
    id: ID!, title: String, price: Int, category: CategoryEnum
    # --- LP Fields ---
    artist: String
    record_label: String
    track_count: Int
    runtime: Int
    release_date: String
    track: [TrackInput!]
  }

  # ==========================================
  # MUTATIONS
  # ==========================================
  type Mutation {
    createBook(input: CreateBookInput!): Product!
    updateBook(input: UpdateBookInput!): Product!
    
    createDVD(input: CreateDVDInput!): Product!
    updateDVD(input: UpdateDVDInput!): Product!
    
    createCD(input: CreateCDInput!): Product!
    updateCD(input: UpdateCDInput!): Product!
    
    createLP(input: CreateLPInput!): Product!
    updateLP(input: UpdateLPInput!): Product!
    
    deleteProducts(ids: [ID!]!): Boolean!
  }
`;