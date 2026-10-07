import { PrismaClient } from '../src/generated/client/index.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

// ---- Permissions ----
const permissionDefs: { name: string; description: string }[] = [
  { name: 'users.view', description: 'View users' },
  { name: 'users.create', description: 'Create users' },
  { name: 'users.update', description: 'Update users' },
  { name: 'users.delete', description: 'Delete users' },
  { name: 'roles.view', description: 'View roles' },
  { name: 'roles.manage', description: 'Manage roles and permissions' },
  { name: 'audit_plan.view', description: 'View audit plan' },
  { name: 'audit_plan.create', description: 'Create audit plan entries' },
  { name: 'audit_plan.update', description: 'Update audit plan entries' },
  { name: 'audit_plan.approve', description: 'Approve audit plan' },
  { name: 'engagements.view', description: 'View engagements' },
  { name: 'engagements.create', description: 'Create engagements' },
  { name: 'engagements.update', description: 'Update engagements' },
  { name: 'engagements.assign', description: 'Assign engagement teams' },
  { name: 'working_papers.view', description: 'View working papers' },
  { name: 'working_papers.create', description: 'Create working papers' },
  { name: 'working_papers.update', description: 'Update working papers' },
  { name: 'working_papers.review', description: 'Review working papers' },
  { name: 'findings.view', description: 'View findings' },
  { name: 'findings.create', description: 'Create findings' },
  { name: 'findings.update', description: 'Update findings' },
  { name: 'findings.approve', description: 'Approve findings' },
  { name: 'actions.view', description: 'View corrective actions' },
  { name: 'actions.create', description: 'Create corrective actions' },
  { name: 'actions.update', description: 'Update corrective actions' },
  { name: 'actions.close', description: 'Close corrective actions' },
  { name: 'reports.view', description: 'View reports' },
  { name: 'reports.create', description: 'Create reports' },
  { name: 'reports.approve', description: 'Approve reports' },
  { name: 'administration.manage', description: 'Full administration access' },
];

// ---- Roles with permission sets ----
const roleDefs: { name: string; description: string; permissions: string[] }[] = [
  {
    name: 'System Administrator',
    description: 'Full system access including user and role management',
    permissions: permissionDefs.map((p) => p.name),
  },
  {
    name: 'Chief Audit Executive',
    description: 'Head of internal audit — full audit lifecycle oversight',
    permissions: [
      'audit_plan.view', 'audit_plan.create', 'audit_plan.update', 'audit_plan.approve',
      'engagements.view', 'engagements.create', 'engagements.update', 'engagements.assign',
      'working_papers.view', 'working_papers.create', 'working_papers.update', 'working_papers.review',
      'findings.view', 'findings.create', 'findings.update', 'findings.approve',
      'actions.view', 'actions.create', 'actions.update', 'actions.close',
      'reports.view', 'reports.create', 'reports.approve',
      'users.view',
      'administration.manage',
    ],
  },
  {
    name: 'Audit Manager',
    description: 'Manages audit engagements and reviews working papers',
    permissions: [
      'audit_plan.view', 'audit_plan.create', 'audit_plan.update',
      'engagements.view', 'engagements.create', 'engagements.update', 'engagements.assign',
      'working_papers.view', 'working_papers.create', 'working_papers.update', 'working_papers.review',
      'findings.view', 'findings.create', 'findings.update', 'findings.approve',
      'actions.view', 'actions.create', 'actions.update', 'actions.close',
      'reports.view', 'reports.create',
      'users.view',
    ],
  },
  {
    name: 'Senior Auditor',
    description: 'Conducts audit fieldwork and prepares working papers',
    permissions: [
      'audit_plan.view',
      'engagements.view', 'engagements.create', 'engagements.update',
      'working_papers.view', 'working_papers.create', 'working_papers.update',
      'findings.view', 'findings.create', 'findings.update',
      'actions.view', 'actions.create', 'actions.update',
      'reports.view', 'reports.create',
    ],
  },
  {
    name: 'Auditor',
    description: 'Performs assigned audit procedures',
    permissions: [
      'audit_plan.view',
      'engagements.view',
      'working_papers.view', 'working_papers.create', 'working_papers.update',
      'findings.view', 'findings.create', 'findings.update',
      'actions.view', 'actions.create',
      'reports.view',
    ],
  },
  {
    name: 'Management',
    description: 'Reviews findings and manages corrective actions',
    permissions: [
      'engagements.view',
      'findings.view', 'findings.update',
      'actions.view', 'actions.create', 'actions.update', 'actions.close',
      'reports.view',
    ],
  },
  {
    name: 'Executive Viewer',
    description: 'Read-only access to audit reports and dashboards',
    permissions: ['audit_plan.view', 'engagements.view', 'findings.view', 'reports.view'],
  },
];

async function main(): Promise<void> {
  console.log('Seeding IAMS database...\n');

  // ---- Create permissions ----
  const permissionMap = new Map<string, string>();
  for (const perm of permissionDefs) {
    const record = await prisma.permission.upsert({
      where: { name: perm.name },
      update: { description: perm.description },
      create: perm,
    });
    permissionMap.set(perm.name, record.id);
  }
  console.log(`  ✓ ${permissionDefs.length} permissions`);

  // ---- Create roles and assign permissions ----
  const roleMap = new Map<string, string>();
  for (const roleDef of roleDefs) {
    const role = await prisma.role.upsert({
      where: { name: roleDef.name },
      update: { description: roleDef.description },
      create: { name: roleDef.name, description: roleDef.description },
    });
    roleMap.set(roleDef.name, role.id);

    for (const permName of roleDef.permissions) {
      const permId = permissionMap.get(permName)!;
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: { roleId: role.id, permissionId: permId },
        },
        update: {},
        create: { roleId: role.id, permissionId: permId },
      });
    }
  }
  console.log(`  ✓ ${roleDefs.length} roles with permission assignments`);

  // ---- Create dev admin user ----
  const adminEmail = 'admin@example.local';
  const passwordHash = await bcrypt.hash('AdminPass123!', 12);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, isActive: true },
    create: {
      firstName: 'System',
      lastName: 'Administrator',
      email: adminEmail,
      passwordHash,
      isActive: true,
    },
  });

  const adminRoleId = roleMap.get('System Administrator')!;
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: adminUser.id, roleId: adminRoleId } },
    update: {},
    create: { userId: adminUser.id, roleId: adminRoleId },
  });

  console.log(`  ✓ Development admin user: ${adminEmail} / AdminPass123!`);
  console.log('\n⚠  Change development credentials before production deployment!\n');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
