
export interface User {
  id: string;
  fullName: string;
  email: string;
  roleId: string;
  roleName: string;
  status: 'Active' | 'Inactive';
  createdAt: string; 
}

/** Datos que necesita el formulario de creación (Historia "Crear usuario"). */
export interface CreateUserInput {
  fullName: string;
  email: string;
  roleId: string;
}