import { 
  type InputCreateBook, type InputUpdateBook,
  type InputCreateDVD, type InputUpdateDVD,
  type InputCreateCD, type InputUpdateCD,
  type InputCreateLP, type InputUpdateLP
} from '@aimsv2/shared';

// Interface cho Repository (Tầng tương tác Database)
export interface IPMRepository {
  createBook(input: InputCreateBook, userId: string): Promise<any>;
  updateBook(input: InputUpdateBook, userId: string): Promise<any>;
  
  createDVD(input: InputCreateDVD, userId: string): Promise<any>;
  updateDVD(input: InputUpdateDVD, userId: string): Promise<any>;
  
  createCD(input: InputCreateCD, userId: string): Promise<any>;
  updateCD(input: InputUpdateCD, userId: string): Promise<any>;
  
  createLP(input: InputCreateLP, userId: string): Promise<any>;
  updateLP(input: InputUpdateLP, userId: string): Promise<any>;
  
  deleteProducts(ids: string[], userId: string): Promise<boolean>;
}

// Interface cho Service (Tầng xử lý Business Logic)
export interface IPMService extends IPMRepository {
  // Service kế thừa lại toàn bộ method của Repository
  // Bạn có thể thêm các method tính toán logic riêng ở đây nếu cần
}