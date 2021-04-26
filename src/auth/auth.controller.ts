import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserErrors } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.authService.signUp(createUserDto);
    } catch (err) {
      const { usernameExists, emailExists } = UserErrors;
      if ([usernameExists, emailExists].includes(err.code)) {
        throw new BadRequestException([err.message]); // send array for consistency with builtin validation
      } else {
        throw err; // bubble up
      }
    }
  }
}
