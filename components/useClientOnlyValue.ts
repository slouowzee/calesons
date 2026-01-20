/**
 * Client Only Value Hook
 *
 * Helper for handling values that should only be present on the client-side.
 * Useful for platform-specific rendering or hydration mismatch avoidance.
 */

/**
 * useClientOnlyValue Hook
 *
 * Returns the client-side value, ignoring the server-side value.
 * This function is designed for environments where server-side rendering is not supported or not main focus.
 *
 * @template S - The type of the server value.
 * @template C - The type of the client value.
 * @param {S} server - The value to use on the server (ignored).
 * @param {C} client - The value to use on the client.
 * @returns {S | C} The client value.
 */
export function useClientOnlyValue<S, C>(server: S, client: C): S | C {
  return client;
}
