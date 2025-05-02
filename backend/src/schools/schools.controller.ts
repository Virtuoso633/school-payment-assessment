import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Controller('schools')
export class SchoolsController {
  constructor(
    @InjectModel('School') private schoolModel: Model<any>,
  ) {}

  @Get()
  async getAllSchools() {
    // Only return id (or school_id) for each school
    const schools = await this.schoolModel.find({}, { _id: 0, school_id: 1 });
    return schools.map((s: any) => ({
      id: s.school_id,
    }));
  }
}