// // src/schemaValidations/article.schema.ts
// import { z } from "zod";

// export const CreateArticleBody = z.object({
//   title: z.string().min(1, "Title is required"),
//   content: z.string().min(1, "Content is required"),
//   thumbnail: z.string().url("Invalid URL").optional(),
// });

// export const UpdateArticleBody = z.object({
//   title: z.string().min(1, "Title is required").optional(),
//   content: z.string().optional(),
//   thumbnail: z.string().url("Invalid URL").optional(),
// });

// export type CreateArticleBodyType = z.infer<typeof CreateArticleBody>;
// export type UpdateArticleBodyType = z.infer<typeof UpdateArticleBody>;

// export type ArticleSchemaType = {
//   articleId: number;
//   title: string;
//   content: string;
//   thumbnail?: string;
//   author: { _id: string; name: string; email: string };
//   createdBy: { _id: string; email?: string };
//   isDeleted?: boolean;
//   createdAt: string;
//   updatedAt: string;
// };

// export type ArticleResType = {
//   status: number;
//   message: string;
//   payload: { data: ArticleSchemaType };
// };

// export type ArticleListResType = {
//   status: number;
//   message: string;
//   payload: {
//     data: {
//       meta: { current: number; pageSize: number; pages: number; total: number };
//       result: ArticleSchemaType[];
//     };
//   };
// };

// src/schemaValidations/article.schema.ts
import { z } from "zod";

export const CreateArticleBody = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  thumbnail: z.string().url("Invalid URL").optional(),
});

export const UpdateArticleBody = z.object({
  title: z.string().min(1, "Title is required").optional(),
  content: z.string().min(1, "Content is required").optional(),
  thumbnail: z.string().url("Invalid URL").optional(),
});

export type CreateArticleBodyType = z.infer<typeof CreateArticleBody>;
export type UpdateArticleBodyType = z.infer<typeof UpdateArticleBody>;

export type ArticleType = {
  _id: string; // Changed from number to string
  title: string;
  content: string;
  thumbnail?: string;
  author: { _id: string; name: string; email: string };
  createdBy: { _id: string; email?: string };
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ArticleResType = {
  statusCode: number;
  message: string;
  data: {
    message: string;
    data: ArticleType;
  };
};

export type ArticleListResType = {
  statusCode: number;
  message: string;
  data: {
    message: string;
    data: {
      meta: {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
      };
      result: ArticleType[];
    };
  };
};
