import { type InputCreatedUser, type InputUpdateUser } from '@aimsv2/shared';
import { adminService } from '../../services/admin/index.js';
import { type MyContext } from '../../server.js'; 
import { requireRoles } from '../../utils/auth.js'; // Nhớ import hàm phân quyền

// ==========================================
// 3. ĐỊNH NGHĨA RESOLVERS
// ==========================================
export const adminResolvers = {
  Query: {
    getUserProfile: requireRoles(
      ['Admin'], 
      true, 
      async (_parent: any, args: { id: string }, context: MyContext) => {
        return await adminService.getUserProfile(args.id);
      }
    )
  },

  Mutation: {
    createUser: requireRoles(
      ['Admin'], 
      true,
      async (_parent: any, args: { input: InputCreatedUser }, context: MyContext) => {
        return await adminService.createUser(args.input);
      }
    ),

    blockUser: requireRoles(
      ['Admin'], 
      true,
      async (_parent: any, args: { id: string }, context: MyContext) => {
        return await adminService.blockUser(args.id);
      }
    ),

    unblockUser: requireRoles(
      ['Admin'], 
      true,
      async (_parent: any, args: { id: string }, context: MyContext) => {
        return await adminService.unblockUser(args.id);
      }
    ),

    resetPasswordUser: requireRoles(
      ['Admin'], 
      true,
      async (_parent: any, args: { id: string; password: string }, context: MyContext) => {
        return await adminService.resetPasswordUser(args.id, args.password);
      }
    ),

    updateUserProfile: requireRoles(
      ['Admin'], 
      true,
      async (_parent: any, args: { id: string; input: InputUpdateUser }, context: MyContext) => {
        return await adminService.updateUserProfile(args.id, args.input);
      }
    ),

    deleteUser: requireRoles(
      ['Admin'], 
      true,
      async (_parent: any, args: { id: string }, context: MyContext) => {
        return await adminService.deleteUser(args.id);
      }
    )
  }
};