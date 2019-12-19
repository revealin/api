import Service from './service';
import ServiceContainer from './service-container';

/**
 * Permissions service.
 * 
 * Used for manage permissions with permissions configuration and roles.
 */
export default class PermissionService extends Service {

    /**
     * Creates a new permissions service.
     * 
     * @param container Services container
     */
    public constructor(container: ServiceContainer) {
        super(container);
    }

    /**
     * Checks if a role has the specified permission.
     * 
     * @param role Role to check
     * @param permission Specified permission
     * @returns True if the role has the specified permission, false otherwise
     */
    public hasPermission(role: string, permission: Permission): boolean {
        const roleConfig = this.container.config.permissions[role];
        return roleConfig && roleConfig.permissions.includes(permission);
    }

    /**
     * Gets the default role.
     * 
     * @returns Default role, or `null` if not exists
     */
    public defaultRole(): string {
        const perms = this.container.config.permissions;
        for (const role in perms) {
            if (perms[role].default) {
                return role;
            }
        }
        return null;
    }
}

/**
 * Permissions.
 */
export type Permission = '';