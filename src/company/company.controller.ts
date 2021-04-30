import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedRequest,
  ParsedBody,
  CrudAuth,
} from '@nestjsx/crud';
import { Company } from './company.entity';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Request } from 'express';
import { USER_REQUEST_KEY } from '../auth/constants';
import { Public } from '../auth/decorators/public';
import { UserObject } from '../common/helpers';
import { CompanyResponseDto } from './dto/company-response.dto';

const persistUserId = (req: Request) => ({
  userId: (req[USER_REQUEST_KEY] as UserObject)?.id,
});

@ApiTags('Companies')
@Crud({
  model: { type: Company },
  query: { softDelete: true },
  routes: {
    exclude: ['replaceOneBase', 'createManyBase'],
  },
  serialize: {
    get: CompanyResponseDto,
    create: CompanyResponseDto,
    update: CompanyResponseDto,
  },
})
@CrudAuth({
  persist: persistUserId,
})
@Controller('companies')
export class CompanyController implements CrudController<Company> {
  constructor(public service: CompanyService) {}

  get base(): CrudController<Company> {
    return this;
  }

  @Public()
  @Override()
  getOne(@ParsedRequest() req: CrudRequest) {
    return this.base.getOneBase?.(req);
  }

  @Public()
  @Override()
  getMany(@ParsedRequest() req: CrudRequest) {
    return this.base.getManyBase?.(req);
  }

  @ApiBearerAuth()
  @Override()
  createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateCompanyDto,
  ) {
    return this.base.createOneBase?.(req, dto as Company);
  }

  @ApiBearerAuth()
  @Override()
  updateOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: UpdateCompanyDto,
  ) {
    return this.base.updateOneBase?.(req, dto as Company);
  }

  @ApiBearerAuth()
  @Override()
  async deleteOne(@ParsedRequest() req: CrudRequest) {
    return this.base.deleteOneBase?.(req);
  }

  @ApiBearerAuth()
  @Override()
  async recoverOne(@ParsedRequest() req: CrudRequest) {
    return this.base.recoverOneBase?.(req);
  }
}
