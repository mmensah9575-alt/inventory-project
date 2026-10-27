export interface Product {
  id: string;
  image:string;
  title: string;
  description: string;
  price: number;
  stock:number;
}
export interface Order {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  buyerName: string;
  buyerPhone: string;
  date: string;
}
export interface User {
  id: string;
  name: string;
  email:string;
  passwordHash: string;
  role: "admin" | "staff";
}



