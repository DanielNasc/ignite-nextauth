import { useCan } from "../hooks/useCan";

type CanProps = {
  children: React.ReactNode;
  permissions?: string[];
  roles?: string[];
};

export function Can({ children, permissions, roles }: CanProps) {
  const canSee = useCan({ permissions, roles });

  if (!canSee) {
    return null;
  }

  return <>{children}</>;
}
