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
 