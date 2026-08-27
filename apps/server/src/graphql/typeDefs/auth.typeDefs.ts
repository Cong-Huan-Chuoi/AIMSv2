export const authTypeDefs = `#graphql
    type AuthUser {
        id: ID!
        fullname: String!
        email: String
        avatar_url: String
    }

    type AuthPayload {
        accessToken: String!
        user: AuthUser 
    }

    input DeviceInfoInput {
        browser: String
        os: String
        deviceType: String
    }

    type Mutation {
        createPassword(userId: ID!, plainPassword: String!): AuthUser!
        
        # Thêm deviceInfo vào luồng Google để lưu thông tin thiết bị
        loginWithGoogle(token: String!, deviceInfo: DeviceInfoInput): AuthPayload!
        login(email: String!, password: String!, deviceInfo: DeviceInfoInput): AuthPayload!
        
        initAppSession: AuthPayload! # Không cần gửi deviceInfo vì Context ở Server tự lấy IP/User-Agent rồi
        logout: Boolean!
    }
`;