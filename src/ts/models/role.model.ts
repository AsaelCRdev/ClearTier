/*Representa un rol.isSystemRole implementa la regla de negocio: los roles de sistema
  no pueden editarse ni eliminarse, ni siquiera por la IA.
*/
export interface Role {
  id: string;
  name: string;
  description: string;
  isSystemRole: boolean;
  usersCount: number;
}

export interface CreateRoleInput {
  name: string;
  description: string;
}
