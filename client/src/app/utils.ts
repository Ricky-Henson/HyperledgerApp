export enum RoleEnum {
  ADMIN = 'admin',
  PATIENT = 'patient',
  DOCTOR = 'doctor',
}

export enum BrowserStorageFields {
  TOKEN = 'token',
  REFRESH_TOKEN = 'refreshToken',
  USER_ROLE = 'role',
  OFFICE_ID = 'officeId',
  USERNAME = 'username',
}
export class Utils {
  public static encode(data: string): string {
    return atob(data);
  }

  public static decode(data: string): string {
    return btoa(data);
  }
}
