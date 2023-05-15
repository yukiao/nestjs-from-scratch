import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateCategoryDto{
    @IsNumber()
    @IsOptional()
    id: number;

    @IsString()
    @IsOptional()
    name: string;
}