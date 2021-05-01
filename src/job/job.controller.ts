import {
  BadRequestException,
  Controller,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { Job } from './job.entity';
import { JobService } from './job.service';
import { Crud, CrudAuth } from '@nestjsx/crud';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public';
import { persistUserId, filterUserId } from '../common/helpers';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobResponseDto } from './dto/job-response.dto';
import { CompanyService } from '../company/company.service';

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
  filter: filterUserId,
  persist: persistUserId,
})
@Controller('companies/:companyId/jobs')
export class JobController implements CrudController<Job> {
  constructor(
    public service: JobService,
    private companyService: CompanyService,
  ) {}

  get base(): CrudController<Job> {
    return this;
  }

  @Override()
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateJobDto,
  ) {
    const companyId = JobController.extractCompanyParam(req);
    if (companyId == null)
      throw new BadRequestException('Missing companyId to create job for');
    const {
      parsed: {
        authPersist: { userId = null },
      },
    } = req;
    if (userId == null)
      throw new UnauthorizedException(
        'Missing credentials in POST-CREATE Job request',
      );
    // check whether company Id belongs to user
    const userCompany = await this.companyService.count({
      id: companyId,
      userId,
    });
    if (userCompany !== 1)
      throw new UnauthorizedException(
        `Not allowed to create job under companyId ${companyId} using provided credentials`,
      );
    // All good continue
    return this.base.createOneBase?.(req, dto as Job);
  }

  private static extractCompanyParam(req: CrudRequest): number | null {
    const {
      parsed: { paramsFilter },
    } = req;
    const { value = null } =
      paramsFilter.find((e) => e.field === 'companyId') ?? {};
    return value;
  }
}
