import { SetMetadata } from '@nestjs/common';
/**
 * This decorator is used to mark a route as a public resource.
 * It sets metadata on the route handler to indicate that it does not require authentication.
 *
 * @returns {Function} A function that sets the metadata on the route handler.
 */
export const META_PUBLIC_RESOURCE = 'is_public_resource';
export const PublicResource = () => SetMetadata(META_PUBLIC_RESOURCE, true);
