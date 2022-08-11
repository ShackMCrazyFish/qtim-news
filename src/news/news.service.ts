import { Injectable } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { News } from './entities/news.entity';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
  ) {}

  create(createNewsDto: CreateNewsDto) {
    const news = new News();
    news.title = createNewsDto.title;
    news.content = createNewsDto.content;

    return this.newsRepository.save(news);
  }

  findAll(): Promise<News[]> {
    return this.newsRepository.find();
  }

  findOne(id: number): Promise<News> {
    return this.newsRepository.findOneBy({ id });
  }

  update(id: number, updateNewsDto: UpdateNewsDto) {
    return this.newsRepository.update(id, updateNewsDto);
  }

  remove(id: number): Promise<DeleteResult> {
    return this.newsRepository.delete(id);
  }
}
