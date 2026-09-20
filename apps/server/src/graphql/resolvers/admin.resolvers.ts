import { type InputCreatedUser, type InputUpdateUser } from '@aimsv2/shared';
import { adminService } from '../../services/admin/index.js';
import { type MyContext } from '../../server.js'; 

// ==========================================
// 3. ĐỊNH NGHĨA RESOLVERS
// ==========================================
export const adminResolvers = {
  Query: {
    getUserProfile: async (
      _parent: any, 
      args: { id: string }, 
      context: MyContext
    ) => {
      // Gọi trực tiếp biến adminService đã được import
      return await adminService.getUserProfile(args.id);
    }
  },

  Mutation: {
    createUser: async (
      _parent: any, 
      args: { input: InputCreatedUser }, 
      context: MyContext
    ) => {
      return await adminService.createUser(args.input);
    },

    blockUser: async (
      _parent: any, 
      args: { id: string }, 
      context: MyContext
    ) => {
      return await adminService.blockUser(args.id);
    },

    unblockUser: async (
      _parent: any, 
      args: { id: string }, 
      context: MyContext
    ) => {
      return await adminService.unblockUser(args.id);
    },
    resetPasswordUser: async (
      _parent: any, 
      args: { id: string; password: string }, 
      context: MyContext
    ) => {
      return await adminService.resetPasswordUser(args.id, args.password);
    },

    updateUserProfile: async (
      _parent: any, 
      args: { id: string; input: InputUpdateUser }, 
      context: MyContext
    ) => {
      return await adminService.updateUserProfile(args.id, args.input);
    },

    deleteUser: async (
      _parent: any, 
      args: { id: string }, 
      context: MyContext
    ) => {
      return await adminService.deleteUser(args.id);
    }
  }
};