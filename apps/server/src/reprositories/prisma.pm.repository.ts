import { prisma } from '../prisma.js';
import { type IPMRepository } from '../services/product/pm.interface.js';
import { 
  type InputCreateBook, type InputUpdateBook,
  type InputCreateDVD, type InputUpdateDVD,
  type InputCreateCD, type InputUpdateCD,
  type InputCreateLP, type InputUpdateLP,
  CategoryEnum 
} from '@aimsv2/shared';

export class PrismaPMRepository implements IPMRepository {

  // =========================================
  // HELPER FUNCTIONS
  // =========================================
  
  // Hàm này trả về các bảng con (Book, CD...) kèm theo thể loại (Genre)
  private buildProductInclude() {
    return {
      book: true,
      dvds: true,
      cds: true,
      lp: true,
      product_genres: {
        include: { genre: true }
      }
    };
  }

  // Hàm xử lý thể loại (Genres)
  private buildGenresMutation(genreIds?: string[]) {
    if (!genreIds || genreIds.length === 0) return undefined;
    return {
      deleteMany: {}, 
      create: genreIds.map((id) => ({ genre: { connect: { id } } }))
    };
  }

  // 🔥 ĐÂY LÀ HÀM FIX LỖI: Lọc bỏ hoàn toàn các field bị undefined
  // Ép kiểu về 'any' ở output để qua mặt Prisma Strict Type Checker
  private cleanData(obj: Record<string, any>): any {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => v !== undefined)
    );
  }

  // =========================================
  // BOOK
  // =========================================
  public async createBook(input: InputCreateBook, userId: string): Promise<any> {
    const { genreIds, authors, cover_type, publisher, publish_date, pages, language, ...baseData } = input;
    
    return await prisma.product.create({
      data: {
        ...this.cleanData(baseData), // Đã clean undefined
        category: CategoryEnum.BOOK,
        book: {
          create: this.cleanData({ authors, cover_type, publisher, publish_date, pages, language }) // Đã clean undefined
        },
        product_genres: this.buildGenresMutation(genreIds),
      },
      include: this.buildProductInclude()
    });
  }

  public async updateBook(input: InputUpdateBook, userId: string): Promise<any> {
    const { id, genreIds, authors, cover_type, publisher, publish_date, pages, language, ...baseData } = input;
    const bookData = this.cleanData({ authors, cover_type, publisher, publish_date, pages, language });

    return await prisma.product.update({
      where: { id },
      data: {
        ...this.cleanData(baseData),
        book: Object.keys(bookData).length > 0 ? {
          upsert: { create: bookData, update: bookData }
        } : undefined,
        ...(genreIds && { product_genres: this.buildGenresMutation(genreIds) }),
      },
      include: this.buildProductInclude()
    });
  }

  // =========================================
  // DVD
  // =========================================
  public async createDVD(input: InputCreateDVD, userId: string): Promise<any> {
    const { genreIds, disc_type, director, runtime, studio, language, subtitle, release_date, ...baseData } = input;
    
    return await prisma.product.create({
      data: {
        ...this.cleanData(baseData),
        category: CategoryEnum.DVD,
        dvds: {
          create: this.cleanData({ disc_type, director, runtime, studio, language, subtitle, release_date })
        },
        product_genres: this.buildGenresMutation(genreIds),
      },
      include: this.buildProductInclude()
    });
  }

  public async updateDVD(input: InputUpdateDVD, userId: string): Promise<any> {
    const { id, genreIds, disc_type, director, runtime, studio, language, subtitle, release_date, ...baseData } = input;
    const dvdData = this.cleanData({ disc_type, director, runtime, studio, language, subtitle, release_date });

    return await prisma.product.update({
      where: { id },
      data: {
        ...this.cleanData(baseData),
        dvds: Object.keys(dvdData).length > 0 ? {
          upsert: { create: dvdData, update: dvdData }
        } : undefined,
        ...(genreIds && { product_genres: this.buildGenresMutation(genreIds) }),
      },
      include: this.buildProductInclude()
    });
  }

  // =========================================
  // CD
  // =========================================
  public async createCD(input: InputCreateCD, userId: string): Promise<any> {
    const { genreIds, artist, record_label, track_count, runtime, release_date, track, ...baseData } = input;
    
    return await prisma.product.create({
      data: {
        ...this.cleanData(baseData),
        category: CategoryEnum.CD,
        cds: {
          create: this.cleanData({ artist, record_label, track_count, runtime, release_date })
        },
        product_genres: this.buildGenresMutation(genreIds),
      },
      include: this.buildProductInclude()
    });
  }

  public async updateCD(input: InputUpdateCD, userId: string): Promise<any> {
    const { id, genreIds, artist, record_label, track_count, runtime, release_date, track, ...baseData } = input;
    const cdData = this.cleanData({ artist, record_label, track_count, runtime, release_date });

    return await prisma.product.update({
      where: { id },
      data: {
        ...this.cleanData(baseData),
        cds: Object.keys(cdData).length > 0 ? {
          upsert: { create: cdData, update: cdData }
        } : undefined,
        ...(genreIds && { product_genres: this.buildGenresMutation(genreIds) }),
      },
      include: this.buildProductInclude()
    });
  }

  // =========================================
  // LP
  // =========================================
  public async createLP(input: InputCreateLP, userId: string): Promise<any> {
    const { genreIds, artist, record_label, track_count, runtime, release_date, track, ...baseData } = input;
    
    return await prisma.product.create({
      data: {
        ...this.cleanData(baseData),
        category: CategoryEnum.LP,
        lp: {
          create: this.cleanData({ artist, record_label, track_count, runtime, release_date })
        },
        product_genres: this.buildGenresMutation(genreIds),
      },
      include: this.buildProductInclude()
    });
  }

  public async updateLP(input: InputUpdateLP, userId: string): Promise<any> {
    const { id, genreIds, artist, record_label, track_count, runtime, release_date, track, ...baseData } = input;
    const lpData = this.cleanData({ artist, record_label, track_count, runtime, release_date });

    return await prisma.product.update({
      where: { id },
      data: {
        ...this.cleanData(baseData),
        lp: Object.keys(lpData).length > 0 ? {
          upsert: { create: lpData, update: lpData }
        } : undefined,
        ...(genreIds && { product_genres: this.buildGenresMutation(genreIds) }),
      },
      include: this.buildProductInclude()
    });
  }

  // =========================================
  // CHUNG (DELETE)
  // =========================================
  public async deleteProducts(ids: string[], userId: string): Promise<boolean> {
    try {
      await prisma.$transaction(async (tx) => {
        const existingProducts = await tx.product.findMany({
          where: { id: { in: ids } }
        });

        if (existingProducts.length === 0) {
          throw new Error("Không tìm thấy sản phẩm nào để xóa.");
        }

        await tx.product_genres.deleteMany({
          where: { product_id: { in: ids } }
        });
        
        await tx.product.deleteMany({
          where: { id: { in: ids } }
        });
      });

      return true;
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      throw error;
    }
  }
}