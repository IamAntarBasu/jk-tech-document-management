/**
 * Interface for the verified JWT payload
 */
export interface VerifiedJWTPayload {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}