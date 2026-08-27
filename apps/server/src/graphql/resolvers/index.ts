import { authResolvers } from './auth.resolvers.js';

// Trong tương lai, khi dự án phình to, bạn chỉ cần import thêm các module ở đây:
// import { productResolvers } from './product.resolvers.js';
// import { cartResolvers } from './cart.resolvers.js';
// import { orderResolvers } from './order.resolvers.js';

export const resolvers = [
    authResolvers,
    
    // Bỏ comment các dòng dưới khi bạn tạo xong các file tương ứng:
    // productResolvers,
    // cartResolvers,
    // orderResolvers,
];