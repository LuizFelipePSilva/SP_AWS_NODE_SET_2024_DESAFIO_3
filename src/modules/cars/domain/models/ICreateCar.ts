

export interface ICreateCar {
  plate: string;
  brand: string;
  model: string;
  km: number;
  year: number;
  price: number;
  status: 'ativo'| 'inativo' | 'excluído' ;
  createdAt: Date | null;
  updatedAt: Date | null;
}
