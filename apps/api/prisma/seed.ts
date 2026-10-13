import { PrismaClient } from '../src/generated/client/index.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

// ---- Permissions ----
const permissionDefs: { name: string; description: string }[] = [
  // Dashboard
  { name: 'dashboard.view', description: 'View dashboard and audit metrics' },

  // Administration - Users and Roles
  { name: 'users.view', description: 'View users' },
  { name: 'users.create', description: 'Create users' },
  { name: 'users.update', description: 'Update users' },
  { name: 'users.delete', description: 'Delete users' },
  { name: 'roles.view', description: 'View roles' },
  { name: 'roles.manage', description: 'Manage roles and permissions' },
  { name: 'activity_logs.view', description: 'View system activity logs' },
  { name: 'administration.settings.view', description: 'View system settings' },
  { name: 'administration.settings.update', description: 'Manage system settings' },
  { name: 'administration.manage', description: 'Full administration access' },

  // Audit Universe - NEW
  { name: 'audit_universe.view', description: 'View the audit universe' },
  { name: 'audit_universe.create', description: 'Create auditable entities' },
  { name: 'audit_universe.update', description: 'Update auditable entities' },
  { name: 'audit_universe.delete', description: 'Delete auditable entities' },

  // Annual Audit Plan
  { name: 'audit_plan.view', description: 'View audit plan' },
  { name: 'audit_plan.create', description: 'Create audit plan entries' },
  { name: 'audit_plan.update', description: 'Update audit plan entries' },
  { name: 'audit_plan.approve', description: 'Approve audit plan' },

  // Risk Assessment
  { name: 'risk_assessment.view', description: 'View risk assessments' },
  { name: 'risk_assessment.create', description: 'Create risk assessments' },
  { name: 'risk_assessment.update', description: 'Update risk assessments' },
  { name: 'risk_assessment.review', description: 'Review risk assessments' },

  // Audit Engagements
  { name: 'engagements.view', description: 'View engagements' },
  { name: 'engagements.create', description: 'Create engagements' },
  { name: 'engagements.update', description: 'Update engagements' },
  { name: 'engagements.assign', description: 'Assign engagement teams' },
  { name: 'engagements.close', description: 'Close audit engagements' },

  // Evidence Tracker - NEW
  { name: 'evidence.view', description: 'View audit evidence' },
  { name: 'evidence.create', description: 'Register audit evidence' },
  { name: 'evidence.upload', description: 'Upload evidence files' },
  { name: 'evidence.update', description: 'Update evidence records' },
  { name: 'evidence.delete', description: 'Delete evidence records' },
  { name: 'evidence.review', description: 'Review audit evidence' },

  // Existing Working Papers permissions - RETAINED
  { name: 'working_papers.view', description: 'View working papers' },
  { name: 'working_papers.create', description: 'Create working papers' },
  { name: 'working_papers.update', description: 'Update working papers' },
  { name: 'working_papers.review', description: 'Review working papers' },

  // Control Testing - NEW
  { name: 'control_testing.view', description: 'View control tests' },
  { name: 'control_testing.create', description: 'Create control tests' },
  { name: 'control_testing.update', description: 'Update control tests and results' },
  { name: 'control_testing.review', description: 'Review control test results' },

  // Audit Findings
  { name: 'findings.view', description: 'View findings' },
  { name: 'findings.create', description: 'Create findings' },
  { name: 'findings.update', description: 'Update findings' },
  { name: 'findings.approve', description: 'Approve findings' },

  // Action Plans and Follow-up - EXTENDED
  { name: 'actions.view', description: 'View corrective actions and action plans' },
  { name: 'actions.create', description: 'Create corrective actions' },
  { name: 'actions.update', description: 'Update corrective actions' },
  { name: 'actions.close', description: 'Close corrective actions' },
  { name: 'actions.follow_up', description: 'Perform corrective action follow-up' },
  { name: 'actions.verify', description: 'Verify corrective action implementation' },

  // Reports
  { name: 'reports.view', description: 'View audit reports' },
  { name: 'reports.create', description: 'Create reports' },
  { name: 'reports.approve', description: 'Approve reports' },
  { name: 'reports.export', description: 'Export audit reports' },

  // Analytics - NEW
  { name: 'analytics.view', description: 'View audit analytics and performance metrics' },

  // Assurance Map - NEW
  { name: 'assurance_map.view', description: 'View assurance map' },
  { name: 'assurance_map.create', description: 'Create assurance map entries' },
  { name: 'assurance_map.update', description: 'Update assurance map entries' },
  { name: 'assurance_map.manage', description: 'Manage assurance coverage' },
];

// ---- Roles with permission sets ----
const roleDefs: {
  name: string;
  description: string;
  permissions: string[];
}[] = [
  {
    name: 'System Administrator',
    description: 'Full system access including user and role management',
    permissions: permissionDefs.map((p) => p.name),
  },

  {
    name: 'Chief Audit Executive',
    description: 'Head of internal audit — full audit lifecycle oversight',
    permissions: [
      'dashboard.view',

      'audit_universe.view',
      'audit_universe.create',
      'audit_universe.update',
      'audit_universe.delete',

      'audit_plan.view',
      'audit_plan.create',
      'audit_plan.update',
      'audit_plan.approve',

      'risk_assessment.view',
      'risk_assessment.create',
      'risk_assessment.update',
      'risk_assessment.review',

      'engagements.view',
      'engagements.create',
      'engagements.update',
      'engagements.assign',
      'engagements.close',

      'working_papers.view',
      'working_papers.create',
      'working_papers.update',
      'working_papers.review',

      'evidence.view',
      'evidence.create',
      'evidence.upload',
      'evidence.update',
      'evidence.review',

      'control_testing.view',
      'control_testing.create',
      'control_testing.update',
      'control_testing.review',

      'findings.view',
      'findings.create',
      'findings.update',
      'findings.approve',

      'actions.view',
      'actions.create',
      'actions.update',
      'actions.close',
      'actions.follow_up',
      'actions.verify',

      'reports.view',
      'reports.create',
      'reports.approve',
      'reports.export',
      'analytics.view',

      'assurance_map.view',
      'assurance_map.create',
      'assurance_map.update',
      'assurance_map.manage',

      'users.view',
      'roles.view',
      'roles.manage',
      'activity_logs.view',
      'administration.settings.view',
      'administration.settings.update',
      'administration.manage',
    ],
  },

  {
    name: 'Audit Manager',
    description: 'Manages audit engagements and reviews working papers',
    permissions: [
      'dashboard.view',

      'audit_universe.view',
      'audit_universe.create',
      'audit_universe.update',

      'audit_plan.view',
      'audit_plan.create',
      'audit_plan.update',

      'risk_assessment.view',
      'risk_assessment.create',
      'risk_assessment.update',
      'risk_assessment.review',

      'engagements.view',
      'engagements.create',
      'engagements.update',
      'engagements.assign',
      'engagements.close',

      'working_papers.view',
      'working_papers.create',
      'working_papers.update',
      'working_papers.review',

      'evidence.view',
      'evidence.create',
      'evidence.upload',
      'evidence.update',
      'evidence.review',

      'control_testing.view',
      'control_testing.create',
      'control_testing.update',
      'control_testing.review',

      'findings.view',
      'findings.create',
      'findings.update',
      'findings.approve',

      'actions.view',
      'actions.create',
      'actions.update',
      'actions.follow_up',
      'actions.verify',
      'actions.close',

      'reports.view',
      'reports.create',
      'reports.export',
      'analytics.view',

      'assurance_map.view',
      'assurance_map.create',
      'assurance_map.update',

      'users.view',
    ],
  },

  {
    name: 'Senior Auditor',
    description: 'Conducts audit fieldwork and prepares working papers',
    permissions: [
      'dashboard.view',

      'audit_universe.view',

      'audit_plan.view',

      'engagements.view',
      'engagements.update',

      'working_papers.view',
      'working_papers.create',
      'working_papers.update',
      'working_papers.review',

      'evidence.view',
      'evidence.create',
      'evidence.upload',
      'evidence.update',
      'evidence.review',

      'control_testing.view',
      'control_testing.create',
      'control_testing.update',
      'control_testing.review',

      'findings.view',
      'findings.create',
      'findings.update',

      'risk_assessment.view',
      'risk_assessment.create',
      'risk_assessment.update',

      'actions.view',
      'actions.create',
      'actions.update',

      'reports.view',
      'reports.create',
      'analytics.view',

      'assurance_map.view',
    ],
  },

  {
    name: 'Auditor',
    description: 'Performs assigned audit procedures',
    permissions: [
      'dashboard.view',

      'audit_universe.view',
      'audit_plan.view',

      'engagements.view',

      'working_papers.view',
      'working_papers.create',
      'working_papers.update',

      'evidence.view',
      'evidence.create',
      'evidence.upload',
      'evidence.update',

      'control_testing.view',
      'control_testing.create',
      'control_testing.update',

      'findings.view',
      'findings.create',
      'findings.update',

      'risk_assessment.view',
      'risk_assessment.create',
      'risk_assessment.update',

      'actions.view',
      'actions.create',
      'actions.update',

      'reports.view',
      'analytics.view',
    ],
  },

  {
    name: 'Management',
    description: 'Responds to audit findings and manages corrective actions',
    permissions: [
      'dashboard.view',
      'engagements.view',
      'findings.view',

      'actions.view',
      'actions.create',
      'actions.update',
      'actions.follow_up',

      'reports.view',
    ],
  },

  {
    name: 'Executive Viewer',
    description: 'Read-only access to audit reports and dashboards',
    permissions: [
      'dashboard.view',
      'audit_universe.view',
      'audit_plan.view',
      'engagements.view',
      'risk_assessment.view',
      'findings.view',
      'actions.view',
      'reports.view',
      'analytics.view',
      'assurance_map.view',
    ],
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
      create: {
        name: roleDef.name,
        description: roleDef.description,
      },
    });

    roleMap.set(roleDef.name, role.id);

    for (const permName of roleDef.permissions) {
      const permId = permissionMap.get(permName);

      if (!permId) {
        throw new Error(
          `Permission "${permName}" is not defined for role "${roleDef.name}"`,
        );
      }

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permId,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: permId,
        },
      });
    }
  }

  console.log(`  ✓ ${roleDefs.length} roles with permission assignments`);

  // ---- Create development admin user ----
  const adminEmail = 'admin@example.local';
  const passwordHash = await bcrypt.hash('AdminPass123!', 12);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      isActive: true,
    },
    create: {
      firstName: 'System',
      lastName: 'Administrator',
      email: adminEmail,
      passwordHash,
      isActive: true,
    },
  });

  const adminRoleId = roleMap.get('System Administrator');

  if (!adminRoleId) {
    throw new Error('System Administrator role was not created');
  }

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: adminRoleId,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: adminRoleId,
    },
  });

  console.log(`  ✓ Development admin user: ${adminEmail} / AdminPass123!`);
  console.log('\n⚠ Change development credentials before production deployment!\n');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });