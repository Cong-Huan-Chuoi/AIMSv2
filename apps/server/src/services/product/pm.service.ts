import { type IPMService, type IPMRepository } from './pm.interface.js';
import { 
  type InputCreateBook, type InputUpdateBook,
  type InputCreateDVD, type InputUpdateDVD,
  type InputCreateCD, type InputUpdateCD,
  type InputCreateLP, type InputUpdateLP
} from '@aimsv2/shared';

export class ProductManagerService implements IPMService {
  private repository: IPMRepository;

  // Dùng Dependency Injection để nhúng Repository vào Service
  constructor(repository: IPMRepository) {
    this.repository = repository;
  }

  async createBook(input: InputCreateBook, userId: string) {
    // Thêm các logic nghiệp vụ (business logic) ở đây nếu có
    return await this.repository.createBook(input, userId);
  }

  async updateBook(input: InputUpdateBook, userId: string) {
    return await this.repository.updateBook(input, userId);
  }

  async createDVD(input: InputCreateDVD, userId: string) {
    return await this.repository.createDVD(input, userId);
  }

  async updateDVD(input: InputUpdateDVD, userId: string) {
    return await this.repository.updateDVD(input, userId);
  }

  async createCD(input: InputCreateCD, userId: string) {
    return await this.repository.createCD(input, userId);
  }

  async updateCD(input: InputUpdateCD, userId: string) {
    return await this.repository.updateCD(input, userId);
  }

  async createLP(input: InputCreateLP, userId: string) {
    return await this.repository.createLP(input, userId);
  }

  async updateLP(input: InputUpdateLP, userId: string) {
    return await this.repository.updateLP(input, userId);
  }

  async deleteProducts(ids: string[], userId: string) {
    return await this.repository.deleteProducts(ids, userId);
  }
}