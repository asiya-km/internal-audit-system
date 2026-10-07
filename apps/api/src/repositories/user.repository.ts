import { prisma } from '../config/db.js';
import type { User, Role, Permission } from '../generated/client/index.js';

export interface UserWithRoles extends User {
  userRoles: {
    role: Role & {
      rolePermissions: {
        permission: Permission;
      }[];
    };
  }[];
}

export class UserRepository {
  async findByEmail(email: string): Promise<UserWithRoles | null> {
    return prisma.user.findUnique({
      where: { email },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: { permission: true },
                },
              },
            },
          },
        },
      },
    });
  }

  async findById(id: string): Promise<UserWithRoles | null> {
    return prisma.user.findUnique({
      where: { id },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: { permission: true },
                },
              },
            },
          },
        },
      },
    });
  }

  async updateLastLogin(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }
}
