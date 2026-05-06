/**
 * ⚠️ DEPRECATED: This file uses localStorage-based auth
 * 
 * DO NOT USE - Use NextAuth session instead.
 * All new code must use:
 * const { data: session } = useSession();
 * Authorization: `Bearer ${session?.accessToken}`
 * 
 * Migrate all usages to src/helpers/data.js helpers
 */

export async function getAdminUsers() {
  throw new Error(
    'getAdminUsers is DEPRECATED. Use NextAuth session-based auth instead. ' +
    'See src/helpers/adminApi.js for migration guide.'
  );
}
