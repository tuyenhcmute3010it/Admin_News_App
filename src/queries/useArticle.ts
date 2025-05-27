// // src/queries/useArticle.ts
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import articlesApiRequest from "@/apiRequests/article";
// import { UpdateArticleBodyType } from "@/schemaValidations/article.schema";

// export const useGetArticleList = (page: number, size: number) => {
//   return useQuery({
//     queryKey: ["articles", page, size],
//     queryFn: () => articlesApiRequest.listArticle(page, size),
//   });
// };

// export const useGetArticle = ({
//   id,
//   enabled,
// }: {
//   id: string;
//   enabled: boolean;
// }) => {
//   return useQuery({
//     queryKey: ["articles", id],
//     queryFn: () => articlesApiRequest.getArticle(id),
//     enabled,
//   });
// };

// export const useAddArticleMutation = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: articlesApiRequest.addArticle,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["articles"] });
//     },
//   });
// };

// export const useUpdateArticleMutation = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({
//       id,
//       ...body
//     }: {
//       id: string;
//       payload: UpdateArticleBodyType;
//     }) => articlesApiRequest.updateArticle(id, body),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["articles"] });
//     },
//   });
// };

// export const useDeleteArticleMutation = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: articlesApiRequest.deleteArticle,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["articles"] });
//     },
//   });
// };

// src/queries/useArticle.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import articleApiRequest from "@/apiRequests/article";
import {
  CreateArticleBodyType,
  UpdateArticleBodyType,
} from "@/schemaValidations/article.schema";

export const useGetArticleList = (
  page: number,
  size: number,
  search?: string
) => {
  return useQuery({
    queryKey: ["articles", page, size, search],
    queryFn: () => articleApiRequest.list(page, size, search),
  });
};

export const useGetArticle = ({
  id,
  enabled,
}: {
  id: string;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["articles", id],
    queryFn: () => articleApiRequest.get(id),
    enabled,
  });
};

export const useAddArticleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateArticleBodyType) => articleApiRequest.add(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
};

export const useUpdateArticleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & UpdateArticleBodyType) =>
      articleApiRequest.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
};

export const useDeleteArticleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => articleApiRequest.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
};

export const useToggleLikeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      articleId,
      quantity,
    }: {
      articleId: string;
      quantity: 1 | -1;
    }) => articleApiRequest.toggleLike(articleId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
};
