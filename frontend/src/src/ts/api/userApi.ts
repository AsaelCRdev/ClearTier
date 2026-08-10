import { delay } from './apiClient';
import { dbGetUsers, dbAddUser, dbFindUserByEmail } from './mockBackend';
import type { User, CreateUserInput } from '../models/user.model';

export async function fetchUsers(): Promise<User[]> {
  return delay(dbGetUsers());
}

/*Implementa el criterio de aceptación de la Historia "Crear usuario":
  el correo debe ser único, o se lanza un error con el mensaje exacto
  que espera mostrar la UI.
 */
export async function createUser(input: CreateUserInput): Promise<User> {
  if (dbFindUserByEmail(input.email)) {
    return delay(null as any).then(() => {
      throw new Error('El correo ya está registrado');
    });
  }
  return delay(dbAddUser(input));
}
