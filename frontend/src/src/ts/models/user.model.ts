/* Representa un usuario del sistema IAM.
   Coincide con la entidad USERS del modelo E-R.
 */
export interface User {
  id: string;
  fullName: string;
  email: string;
  roleId: string;
  roleName: string; 
  status: 'Active' | 'Inactive';
  createdAt: string; 
}

/* Datos que necesita el formulario de creación. */
export interface CreateUserInput {
  fullName: string;
  email: string;
  roleId: string;
}
