import { Controller } from '@nestjs/common';
import { CrudController } from '@nestjsx/crud';
import { Job } from './job.entity';
import { JobService } from './job.service';
import { Crud, CrudAuth } from '@nestjsx/crud';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public';
import { persistUserId } from '../common/helpers';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobResponseDto } from './dto/job-response.dto';

@ApiTags('Jobs')
@Crud({
  model: { type: Job },
  dto: { create: CreateJobDto, update: UpdateJobDto },
  serialize: {
    get: JobResponseDto,
    create: JobResponseDto,
    update: JobResponseDto,
  },
  params: { companyId: { field: 'companyId', type: 'number' } },
  query: { softDelete: true },
  routes: {
    exclude: ['replaceOneBase', 'createManyBase'],
    getOneBase: { decorators: [Public()] },
    getManyBase: { decorators: [Public()] },
    createOneBase: { decorators: [ApiBearerAuth()] },
    updateOneBase: { decorators: [ApiBearerAuth()] },
    deleteOneBase: { decorators: [ApiBearerAuth()] },
    recoverOneBase: { decorators: [ApiBearerAuth()] },
  },
})
@CrudAuth({
  persist: persistUserId,
})
@Controller('companies/:companyId/jobs')
export class JobController implements CrudController<Job> {
  constructor(public service: JobService) {}
}
