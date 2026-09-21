import { requireRoles } from '../../utils/auth.js';
import { PMService } from '../../services/product/pm.index.js';
import { type MyContext } from '../../server.js';
import { 
  type InputCreateBook, type InputUpdateBook,
  type InputCreateDVD, type InputUpdateDVD,
  type InputCreateCD, type InputUpdateCD,
  type InputCreateLP, type InputUpdateLP
} from '@aimsv2/shared';

export const pmResolvers = {
  Product: {
    genres: (parent: any) => {
      if (!parent.product_genres) return [];
      return parent.product_genres.map((pg: any) => pg.genre);
    }
  },

  Mutation: {
    // ==========================================
    // BOOK
    // ==========================================
    createBook: requireRoles(['Product_Manager'], true, 
      async (_: any, { input }: { input: InputCreateBook }, context: MyContext) => {
        return await PMService.createBook(input, context.user!.userId!);
      }
    ),
    updateBook: requireRoles(['Product_Manager'], true, 
      async (_: any, { input }: { input: InputUpdateBook }, context: MyContext) => {
        return await PMService.updateBook(input, context.user!.userId!);
      }
    ),

    // ==========================================
    // DVD
    // ==========================================
    createDVD: requireRoles(['Product_Manager'], true, 
      async (_: any, { input }: { input: InputCreateDVD }, context: MyContext) => {
        return await PMService.createDVD(input, context.user!.userId!);
      }
    ),
    updateDVD: requireRoles(['Product_Manager'], true, 
      async (_: any, { input }: { input: InputUpdateDVD }, context: MyContext) => {
        return await PMService.updateDVD(input, context.user!.userId!);
      }
    ),

    // ==========================================
    // CD & LP
    // ==========================================
    createCD: requireRoles(['Product_Manager'], true, 
      async (_: any, { input }: { input: InputCreateCD }, context: MyContext) => {
        return await PMService.createCD(input, context.user!.userId!);
      }
    ),
    updateCD: requireRoles(['Product_Manager'], true, 
      async (_: any, { input }: { input: InputUpdateCD }, context: MyContext) => {
        return await PMService.updateCD(input, context.user!.userId!);
      }
    ),

    createLP: requireRoles(['Product_Manager'], true, 
      async (_: any, { input }: { input: InputCreateLP }, context: MyContext) => {
        return await PMService.createLP(input, context.user!.userId!);
      }
    ),
    updateLP: requireRoles(['Product_Manager'], true, 
      async (_: any, { input }: { input: InputUpdateLP }, context: MyContext) => {
        return await PMService.updateLP(input, context.user!.userId!);
      }
    ),

    // ==========================================
    // CHUNG
    // ==========================================
    deleteProducts: requireRoles(['Product_Manager'], true, 
      async (_: any, { ids }: { ids: string[] }, context: MyContext) => {
        return await PMService.deleteProducts(ids, context.user!.userId!);
      }
    )
  }
};