type User = {
  permissions: string[];
  roles: string[];
};

type ValidateUserPermissionsParams = {
  user: User;
  permissions?: string[];
  roles?: string[];
};

export function validateUserPermissions({
  user,
  permissions,
  roles,
}: ValidateUserPermissionsParams) {
  if (!user) {
    return false;
  }

  console.log(user);

  if (permissions && permissions.length > 0) {
    const hasAllPermissions = permissions.every(
      (permission) => user.permissions.includes(permission) // check if user has all permissions
    );

    if (!hasAllPermissions) {
      return false;
    }
  }

  if (roles && roles.length > 0) {
    const hasAllRoles = roles.some((role) => user.roles.includes(role));

    if (!hasAllRoles) {
      return false;
    }
  }

  return true;
}
