import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { Request, Response } from 'express';

import { logger } from '@/lib/winstone';

import Blog from '@/models/blogs';
import { IBlog } from '@/models/blogs';

// Purify dom content
const window = new JSDOM('').window;
const purify = DOMPurify(window);

type BlogData

const create_blog = async (req: Request, res: Response) => {
  const blogData = req.body;

  try {
    const blog = new Blog(blogData);
    await blog.save();

    logger.info('Blog created successfully', { blogId: blog._id });

    return res.status(201).json({
      message: 'Blog created successfully',
      code: 'Created',
      data: blog,
    });
  } catch (error) {
    logger.error('Error while creating blog', error);
    return res.status(500).json({
      message: 'Internal Server Error',
      code: 'InternalServerError',
    });
  }
};

export default create_blog;
