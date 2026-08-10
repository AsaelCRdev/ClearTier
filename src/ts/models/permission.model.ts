/* Un "Resource" es una pantalla/módulo protegido.*/
export interface Resource {
  id: string;
  name: string;
  label: string; // nombre legible para la UI, es decir el recurso
}

/* Efecto de una celda de la matriz. "UNSET" significa que no hay una regla
   explícita para ese rol+recurso.Este tipo modela el atributo `effect` de la entidad 
   ROLE_PERMISSIONS.
 */
export type PermissionEffect = 'ALLOW' | 'DENY' | 'UNSET';

/* Una celda concreta de la matriz: qué rol, qué recurso, qué efecto. */
export interface PermissionCell {
  roleId: string;
  resourceId: string;
  effect: PermissionEffect;
}
