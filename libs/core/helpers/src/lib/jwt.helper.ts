import { UnauthorizedException } from '@nestjs/common';
import { jwtDecode } from 'jwt-decode';

export class JwtHelper {
  public static decode(data: string): any {
    try {
      return jwtDecode(data);
    } catch (err: any) {
      if (err && err.message.toLowerCase().startsWith('invalid token')) {
        throw new UnauthorizedException('Invalid token');
      }
      throw err;
    }
  }
  public static readValue(token: string, field: string): any {
    const ret = JwtHelper.decode(token);
    return ret[field];
  }
}
