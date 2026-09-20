

export const adminTypeDefs = `#graphql
  # ==========================================
  # 1. ENUMS
  # ==========================================
  enum GenderEnum {
    male
    female
    unknown
  }

  enum RoleEnum {
    Admin
    Product_Manager
    Customer
  }

  # ==========================================
  # 2. OUTPUT TYPES (Dữ liệu Backend trả về)
  # ==========================================
  type Role {
    id: ID!
    name_role: RoleEnum!
    role_num: Int
  }

  type UserRole {
    user_id: ID!
    role_id: ID!
    roles: Role!
  }

  type User {
    id: ID!
    fullname: String!
    email: String
    avatar_url: String
    date_of_birth: String
    phone_num: String
    gender: GenderEnum
    status: Boolean!
    created_at: String!
    updated_at: String!
    roles: [UserRole!] # <--- ĐÃ SỬA THÀNH roles ĐỂ KHỚP VỚI PRISMA
  }

  # ==========================================
  # 3. INPUT TYPES (Dữ liệu Frontend gửi lên)
  # ==========================================
  input InputCreatedUser {
    fullname: String!
    email: String!
    password: String!
    roles: [RoleEnum!] # <--- Frontend truyền cực dễ: ["Customer", "Admin"]
  }

  input InputUpdateUser {
    fullname: String
    email: String
    avatar_url: String
    date_of_birth: String
    phone_num: String
    gender: GenderEnum
    roles: [RoleEnum!]
  }

  # ==========================================
  # 4. OPERATIONS (Queries & Mutations)
  # ==========================================
  type Query {
    getUserProfile(id: ID!): User!
  }

  type Mutation {
    createUser(input: InputCreatedUser!): User!
    blockUser(id: ID!): User!
    resetPasswordUser(id: ID!, password: String!): User!
    updateUserProfile(id: ID!, input: InputUpdateUser!): User!
    deleteUser(id: ID!): User!
  }
`;