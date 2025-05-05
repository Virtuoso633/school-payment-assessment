import { Model } from 'mongoose';
export declare class SchoolsController {
    private schoolModel;
    constructor(schoolModel: Model<any>);
    getAllSchools(): Promise<{
        id: any;
    }[]>;
}
