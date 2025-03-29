import { SetMetadata } from "@nestjs/common";
import { PermissionHandler } from "../access-control-rule-middleware/types";
import { CHECK_PERMISSIONS_KEY } from "../constants/checkPermission.token";

export const CheckPermissions = (...handlers: PermissionHandler[]) =>
  SetMetadata(CHECK_PERMISSIONS_KEY, handlers);
