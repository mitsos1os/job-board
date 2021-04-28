import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserErrors } from '../users/users.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserObject } from '../common/helpers';
import { Public } from './decorators/public';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Sign up a user to the application by providing proper information
   * @param {CreateUserDto} createUserDto
   */
  @Public()
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

  /**
   * Login the user to the application and return the created access token
   * @param {Request} req
   */
  @ApiBody({
    type: LoginDto,
  })
  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  login(@Req() req: Request) {
    return this.authService.login(req.user as UserObject);
  }
}
