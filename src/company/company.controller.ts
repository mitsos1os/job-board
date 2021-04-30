import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudAuth } from '@nestjsx/crud';
import { Company } from './company.entity';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Public } from '../auth/decorators/public';
import { persistUserId } from '../common/helpers';
import { CompanyResponseDto } from './dto/company-response.dto';

@ApiTags('Companies')
@Crud({
  model: { type: Company },
  query: { softDelete: true, join: { addresses: {} } },
  dto: { create: CreateCompanyDto, update: UpdateCompanyDto },
  routes: {
    exclude: ['replaceOneBase', 'createManyBase'],
    getOneBase: { decorators: [Public()] },
    getManyBase: { decorators: [Public()] },
    createOneBase: { decorators: [ApiBearerAuth()] },
    updateOneBase: { decorators: [ApiBearerAuth()] },
    deleteOneBase: { decorators: [ApiBearerAuth()] },
    recoverOneBase: { decorators: [ApiBearerAuth()] },
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
}
