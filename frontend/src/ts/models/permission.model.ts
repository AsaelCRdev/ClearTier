/*Se refiere a un recurso protegido del sistems*/
export interface Resource {
  id: string;
  name: string;
  label: string; 
}

/* Este efecto que es "UNSET" significa que no hay una regla que no se asocia al rol con un recuso*/
export type PermissionEffect = 'ALLOW' | 'DENY' | 'UNSET';

/*Paraarmar cada celda. */
export interface PermissionCell {
  roleId: string;
  resourceId: string;
  effect: PermissionEffect;
}