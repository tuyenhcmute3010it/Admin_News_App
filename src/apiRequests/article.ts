// src/lib/api.ts

import http from "@/lib/http";

export interface Article {
  _id: string;
  title: string;
  content: string;
  thumbnail?: string;
  author: { _id: string; name: string; email: string };
  createdBy: { _id: string; email?: string };
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Like {
  _id: string;
  user: string;
  article: { _id: string; title: string; thumbnail?: string };
  quantity: 1 | -1;
}

export const getArticles = (page: number, limit: number, query?: string) =>
  http.get<{
    meta: { current: number; pageSize: number; pages: number; total: number };
    result: Article[];
  }>("/api/v1/articles", {
    params: { current: page, pageSize: limit },
  });

export const createArticle = (data: {
  title: string;
  content: string;
  thumbnail?: string;
}) => http.post("/api/v1/articles", data);

export const updateArticle = (
  id: string,
  data: { title: string; content: string; thumbnail?: string }
) => http.put(`/api/v1/articles/${id}`, data);

export const deleteArticle = (id: string) =>
  http.delete(`/api/v1/articles/${id}`);

export const toggleLike = (articleId: string, quantity: 1 | -1) =>
  http.post("/api/v1/likes", { article: articleId, quantity });
