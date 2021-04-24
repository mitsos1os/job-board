import { plainToClass } from 'class-transformer';
import { IsString, IsNumberString, validateSync } from 'class-validator';

export class EnvConfig {
  @IsNumberString()
  PORT!: string;

  @IsString()
  DB_HOST!: string;

  @IsNumberString()
  DB_PORT!: string;

  @IsString()
  DB_NAME!: string;

  @IsString()
  DB_USER!: string;

  @IsString()
  DB_PASS!: string;
}

/**
 *
 * @param {object} config
 */
export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvConfig, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
