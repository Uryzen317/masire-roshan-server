import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentDto, LikeDto, ReplieDto } from '../dtos/comments.dto';
import { Comment } from '../models/comment.model';
import { Post } from '../models/post.model';
import { Replie } from '../models/replie.model';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) public comments: Model<Comment>,
    @InjectModel(Replie.name) public replies: Model<Replie>,
    @InjectModel(Post.name) public posts: Model<Post>,
    public jwtService: JwtService,
  ) {}

  async comment(
    commentDto: CommentDto, id : string,
  ) {
    let comment = new this.replies({
      replieTo: commentDto.postId,
      replie: commentDto.comment,
      author: id,
    });
    await comment.save();

    await this.posts.updateOne(
      { _id: commentDto.postId },
      { $inc: { comments: 1 } },
    );
    await this.replies.updateOne(
      { _id: commentDto.postId },
      { $inc: { replies: 1 } },
    );

    return {};
  }

  async list(postId: string, accessToken: string = null) {
    let comments = await this.replies
      .find({ replieTo : postId })
      .populate('author')
      .sort({ createdAt: -1 })
      .limit(50)
      .skip(0)
      .lean();

    if (!accessToken || accessToken == 'null') {
      return comments.map((c: any) => {
        c.author = {
          username: c.author.username,
          avatar: c.author.avatar,
          role: c.author.role,
        };
        return c;
      });
    }

    try {
      let user = this.jwtService.verify(accessToken);
      return comments.map((c: any) => {
        c.author = {
          username: c.author.username,
          avatar: c.author.avatar,
          role: c.author.role,
        };
        c.hasLiked = c.likesList?.find((l) => {
          return l == user.id;
        })
          ? true
          : false;
        c.hasDisliked = c.dislikesList?.find((l) => {
          return l == user.id;
        })
          ? true
          : false;
        return c;
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  async like(likeDto: LikeDto, id: string) {
    let hasLiked = await this.replies.findOne({
      _id: likeDto.commentId,
      likesList: { $in: [id] },
    });

    if (hasLiked) {
      throw new BadRequestException();
    }

    // remove dislikes (if theres any)
    await this.replies.findOneAndUpdate(
      {
        _id: likeDto.commentId,
        dislikesList: { $in: [id] },
      },
      {
        $pull: { dislikesList: id },
        $inc: { dislikes: -1 },
      },
    );

    await this.replies.findByIdAndUpdate(
      {
        _id: likeDto.commentId,
      },
      {
        $push: { likesList: id },
        $inc: { likes: 1 },
      },
    );

    return {};
  }

  async dislike(likeDto: LikeDto, id: string) {
    let hasDisliked = await this.replies.findOne({
      _id: likeDto.commentId,
      dislikesList: { $in: [id] },
    });

    if (hasDisliked) {
      throw new BadRequestException();
    }

    // remove likes (if theres any)
    await this.replies.findOneAndUpdate(
      {
        _id: likeDto.commentId,
        likesList: { $in: [id] },
      },
      {
        $pull: { likesList: id },
        $inc: { likes: -1 },
      },
    );

    await this.replies.findByIdAndUpdate(
      {
        _id: likeDto.commentId,
      },
      {
        $push: { dislikesList: id },
        $inc: { dislikes: 1 },
      },
    );

    return {};
  }

  async replie(replieDto: ReplieDto, id: string) {
    let replie = new this.replies({
      replieTo: replieDto.commentId,
      replie: replieDto.replie,
      author: id,
    });
    await replie.save();
    await this.comments.findOneAndUpdate(
      { _id: replieDto.commentId },
      { $inc: { replies: 1 } },
    );

    return {};
  }

  async repliesList(postId: string, accessToken: string) {
    let comments = await this.replies
      .find({ replieTo: postId })
      .populate('author')
      .sort({ createdAt: -1 })
      .lean();

    if (!accessToken || accessToken == 'null') {
      return comments.map((c: any) => {
        c.author = {
          username: c.author.username,
          avatar: c.author.avatar,
          role: c.author.role,
        };
        c.hasLiked = c.likesList.find((l) => {
          return l == '';
        });
        return c;
      });
    }

    try {
      let user = this.jwtService.verify(accessToken);
      return comments.map((c: any) => {
        c.author = {
          username: c.author.username,
          avatar: c.author.avatar,
          role: c.author.role,
        };
        c.hasLiked = c.likesList?.find((l) => {
          return l == user.id;
        })
          ? true
          : false;
        c.hasDisliked = c.dislikesList?.find((l) => {
          return l == user.id;
        })
          ? true
          : false;
        return c;
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  async likeReplie(likeDto: LikeDto, id: string) {
    let hasLiked = await this.replies.findOne({
      _id: likeDto.commentId,
      likesList: { $in: [id] },
    });

    if (hasLiked) {
      throw new BadRequestException();
    }

    // remove dislikes (if theres any)
    await this.replies.findOneAndUpdate(
      {
        _id: likeDto.commentId,
        dislikesList: { $in: [id] },
      },
      {
        $pull: { dislikesList: id },
        $inc: { dislikes: -1 },
      },
    );

    await this.replies.findByIdAndUpdate(
      {
        _id: likeDto.commentId,
      },
      {
        $push: { likesList: id },
        $inc: { likes: 1 },
      },
    );

    return {};
  }

  async dislikeReplie(likeDto: LikeDto, id: string) {
    let hasDisliked = await this.replies.findOne({
      _id: likeDto.commentId,
      dislikesList: { $in: [id] },
    });

    if (hasDisliked) {
      throw new BadRequestException();
    }

    // remove likes (if theres any)
    await this.replies.findOneAndUpdate(
      {
        _id: likeDto.commentId,
        likesList: { $in: [id] },
      },
      {
        $pull: { likesList: id },
        $inc: { likes: -1 },
      },
    );

    await this.replies.findByIdAndUpdate(
      {
        _id: likeDto.commentId,
      },
      {
        $push: { dislikesList: id },
        $inc: { dislikes: 1 },
      },
    );

    return {};
  }
}
