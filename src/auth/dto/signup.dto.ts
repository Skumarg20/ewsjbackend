export class SignUpDto {
    username: string;
    email: string;
    fullname:string;
    password: string;
    phonenumber:string;
    studentclass:string;
  
    exam:string;
    address?: Record<string, any>;
  }