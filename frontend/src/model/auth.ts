export interface SignupInfo{
      email:string,
      password:string,
      name:string
}
export interface User extends SignupInfo {
    lastLogin: string | Date;
    isVerified: boolean;
    createdAt: string | Date;
    updatedAt: string | Date;
    resetPasswordToken: string;
    resetPasswordExpiredAt: Date;
    verificationToken: string;
    verificationTokenExpired: Date;
}
