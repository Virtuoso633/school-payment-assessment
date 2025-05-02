import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SchoolsController } from './schools.controller';

// Define a simple schema if you don't have one yet
import { Schema } from 'mongoose';
const SchoolSchema = new Schema({ school_id: String });

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'School', schema: SchoolSchema },
    ]),
  ],
  controllers: [SchoolsController],
})
export class SchoolsModule {}