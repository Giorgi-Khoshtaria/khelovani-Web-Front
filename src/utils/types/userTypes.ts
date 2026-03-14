export interface UserTypes {
  idNumber: string;
  nameGe?: string;
  nameEn: string;
  dateOfBirth: string;
  city: string;
  address: string;
  email: string;
  password: string;
  // isActive: boolean;
}

export interface LoginTypes {
  email: string;
  password: string;
}
