import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Category from './category.entity';
import { Equal, Repository } from 'typeorm';
import { CategoryNotFoundException } from './exception/category-not-found.exception';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    constructor(@InjectRepository(Category) private readonly categoriesRepository: Repository<Category>){

    }

    getAllCategories(){
        return this.categoriesRepository.find({
            relations: ['posts']
        })
    }

    async getCategoryById(id: number){
        const category = await this.categoriesRepository.findOne({
            where:{
                id: Equal(id)
            }, 
            relations: [ 'posts' ]
        })

        if(category){
            return category
        }

        throw new CategoryNotFoundException(id)
    }

    async updateCategory(id: number, category: UpdateCategoryDto){
       await this.categoriesRepository.update(id, category);
       const updatedCategory = await this.categoriesRepository.findOne({
        where: {
            id: Equal(id)
        },
        relations: ["posts"]
       }) 

       if(updatedCategory){
        return updatedCategory
       }

       throw new CategoryNotFoundException(id)
    }

}
