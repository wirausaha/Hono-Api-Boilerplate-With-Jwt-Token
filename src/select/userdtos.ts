export const userDtos = {
  UserId: true,
  UserName: true,
  Email: true,
  PhoneNumber: true,
  FirstName: true,
  LastName: true,
  DateOfBirth: true,
  Address: true,
  Address2: true,
  Province: true,
  City: true,
  ZipCode: true,
  Avatar200x200: true,
  UserRole: true,
  IsActive: true,
  IsEmailConfirmed: true,
  IsPhoneConfirmed: true
}

export type userInputDto = {
  UserId: string,
  UserName: string,
  Password: string,
  Email: string,
  PhoneNumber?: string,
  FirstName?: string,
  LastName?: string,
  DateOfBirth?: string,
  Address?: string,
  Address2?: string,
  Province?: string,
  City?: string,
  ZipCode?: string,
  Avatar200x200?: string,
  UserRole: string,
  IsActive: number,
  IsEmailConfirmed: number,
  IsPhoneConfirmed: number, 
  AvatarFile: File
}  

export type changePasswordDto = {
  userName: string,
  oldPassword: string,
  newPassword: string
}  