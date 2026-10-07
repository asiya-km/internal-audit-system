import type { UserWithRoles } from '../repositories/user.repository.js';
import type { UserDto, RoleDto } from '@iams/shared';

export function mapUserToDto(user: UserWithRoles): UserDto {
  const roles: RoleDto[] = user.userRoles.map((ur) => ({
    id: ur.role.id,
    name: ur.role.name,
    description: ur.role.description,
  }));

  const permissions = [
    ...new Set(
      user.userRoles.flatMap((ur) =>
        ur.role.rolePermissions.map((rp) => rp.permission.name),
      ),
    ),
  ];

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    isActive: user.isActive,
    lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
    roles,
    permissions,
  };
}
