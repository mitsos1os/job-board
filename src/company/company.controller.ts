import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedRequest,
  ParsedBody,
} from '@nestjsx/crud';
import { Company } from './company.entity';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@ApiTags('Companies')
@Crud({
  model: { type: Company },
  query: { softDelete: true },
  routes: {
    exclude: ['replaceOneBase', 'createManyBase'],
  },
})
@Controller('companies')
export class CompanyController implements CrudController<Company> {
  constructor(public service: CompanyService) {}

  get base(): CrudController<Company> {
    return this;
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
