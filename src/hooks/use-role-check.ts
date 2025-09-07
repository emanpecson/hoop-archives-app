import { Session } from "next-auth";

export default function useRoleCheck(session: Session | null) {
  const betaRoleName: string = "BetaUser";

  const isBetaUser = () => {
    if (!session || !session.user) return true; // default role is beta user

    const { groups } = session.user;

    // default role is beta user
    if (!groups || groups.length === 0) return true;

    // otherwise, check if user belongs in beta group
    return groups.some((roleName: string) => roleName === betaRoleName);
  };

  return { isBetaUser };
}
