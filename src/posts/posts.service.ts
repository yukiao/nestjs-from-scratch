import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from '../posts/dtos/create-post.dto';
import { UpdatePostDto } from '../posts/dtos/update-post.dto';
import PostEntity from '../posts/post.entity';
import { Post } from '../posts/post.interface';
import { Equal, Repository } from 'typeorm';
import { PostNotFoundException } from './exception/post-not-found.exception';
import User from '../users/user.entity';

@Injectable()
export default class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  getAllPosts() {
    return this.postRepository.find({ relations: ["author"]});
  }

  async getPostById(id: number) {
    const post = await this.postRepository.findOne({
      where: {
        id: Equal(id)
      },
      relations: ['author']
    });

    if(post){
      return post;
    }
    throw new PostNotFoundException(id);
  }

  // async replacePost(id: number, post: UpdatePostDto) {
  //   await this.postRepository.update(id, post);
  //   const updatedPost = await this.postRepository.findOne({
  //     where: {
  //       id: Equal(id),
  //     },
  //   });
  //   if (updatedPost) {
  //     return updatedPost;
  //   }
  //   throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  // }

  async updatePost(id: number, post: UpdatePostDto){
    await this.postRepository.update(id, post);
    const updatedPost = await this.postRepository.findOne({
      where: {
        id: Equal(id),
      },
      relations: ['author']
    });
    if(updatedPost){
      return updatedPost;
    }
    throw new PostNotFoundException(id);
  }

  async createPost(post: CreatePostDto, user: User) {
    const newPost = await this.postRepository.create({
      ...post,
      author: user
    });
    await this.postRepository.save(newPost);
    return newPost;
  }

  async deletePost(id: number) {
    const deleteResponse = await this.postRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
  }
}
