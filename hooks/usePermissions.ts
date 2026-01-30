import { useCallback } from 'react';
import { Platform } from 'react-native';
import { PERMISSIONS, RESULTS, request, PermissionStatus } from 'react-native-permissions';

export type TUsePermissionsReturnType = {
  isError?: boolean;
  type: PermissionStatus;
  errorMessage?: string;
};

export enum EPermissionTypes {
  CAMERA = 'camera',
}

const isIos = Platform.OS === 'ios';
const isAndroid = Platform.OS === 'android';

export const usePermissions = (typeOfPermission: EPermissionTypes) => {
  const getPermission = useCallback(() => {
    if (isIos) {
      switch (typeOfPermission) {
        case EPermissionTypes.CAMERA:
          return PERMISSIONS.IOS.CAMERA;
        default:
          return PERMISSIONS.IOS.CAMERA;
      }
    }
    if (isAndroid) {
      switch (typeOfPermission) {
        case EPermissionTypes.CAMERA:
          return PERMISSIONS.ANDROID.CAMERA;
        default:
          return PERMISSIONS.ANDROID.CAMERA;
      }
    }
    return PERMISSIONS.IOS.CAMERA; // Default
  }, [typeOfPermission]);

  const askPermissions = useCallback(async (): Promise<TUsePermissionsReturnType> => {
    try {
      const permission = getPermission();
      const result = await request(permission);
      return { type: result };
    } catch (error) {
      return { isError: true, type: RESULTS.DENIED, errorMessage: 'Permission request failed' };
    }
  }, [getPermission]);

  return { askPermissions };
};
