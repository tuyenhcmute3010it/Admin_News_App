// src/app/articles/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppContext } from "@/components/app-provider";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { z } from "zod";
import http from "@/lib/http";
import {
  deleteArticle,
  getArticles,
  createArticle,
  updateArticle,
  toggleLike,
} from "@/apiRequests/article";

const ArticleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  thumbnail: z.string().url("Invalid URL").optional(),
  thumbnailFile: z.instanceof(File).optional(),
});

type ArticleFormType = z.infer<typeof ArticleSchema>;

export default function Articles() {
  const { isAuth } = useAppContext();
  const router = useRouter();
  const t = useTranslations("Articles");
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<ArticleFormType>({
    resolver: zodResolver(ArticleSchema),
    defaultValues: {
      title: "",
      content: "",
      thumbnail: "",
      thumbnailFile: undefined,
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["articles", page, search],
    queryFn: () => getArticles(page, 10, search),
    enabled: isAuth,
  });

  const createMutation = useMutation({
    mutationFn: async (data: ArticleFormType) => {
      let thumbnail = data.thumbnail;
      console.log(">>>>", data);
      if (data.thumbnailFile) {
        const formData = new FormData();
        formData.append("file", data.thumbnailFile);
        formData.append("folder", "article-thumbnails");
        const uploadResult = await http.post<{ data: { fileName: string } }>(
          "/api/v1/files",
          formData
        );
        thumbnail = `/upload/article-thumbnails/${uploadResult.payload.data.fileName}`;
      }
      return createArticle({
        title: data.title,
        content: data.content,
        thumbnail,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      form.reset();
      setIsModalOpen(false);
      toast({ description: t("createSuccess") });
    },
    onError: () =>
      toast({ variant: "destructive", description: t("createError") }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ArticleFormType }) => {
      let thumbnail = data.thumbnail;
      if (data.thumbnailFile) {
        const formData = new FormData();
        formData.append("file", data.thumbnailFile);
        formData.append("folder", "article-thumbnails");
        const uploadResult = await http.post<{ data: { fileName: string } }>(
          "/api/v1/files",
          formData
        );
        thumbnail = `/upload/article-thumbnails/${uploadResult.payload.data.fileName}`;
      }
      return updateArticle(id, {
        title: data.title,
        content: data.content,
        thumbnail,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      form.reset();
      setEditingId(null);
      setIsModalOpen(false);
      toast({ description: t("updateSuccess") });
    },
    onError: () =>
      toast({ variant: "destructive", description: t("updateError") }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast({ description: t("deleteSuccess") });
    },
    onError: () =>
      toast({ variant: "destructive", description: t("deleteError") }),
  });

  const likeMutation = useMutation({
    mutationFn: ({
      articleId,
      quantity,
    }: {
      articleId: string;
      quantity: 1 | -1;
    }) => toggleLike(articleId, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["articles"] }),
    onError: () =>
      toast({ variant: "destructive", description: t("likeError") }),
  });

  const onSubmit = (data: ArticleFormType) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (article: any) => {
    setEditingId(article._id);
    form.setValue("title", article.title);
    form.setValue("content", article.content);
    form.setValue("thumbnail", article.thumbnail || "");
    form.setValue("thumbnailFile", undefined);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm(t("confirmDelete"))) {
      deleteMutation.mutate(id);
    }
  };

  const handleLike = (articleId: string, quantity: 1 | -1) => {
    likeMutation.mutate({ articleId, quantity });
  };

  useEffect(() => {
    if (!isAuth) router.push("/login");
  }, [isAuth, router]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>{t("create")}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? t("update") : t("create")}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("title")}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Article title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("content")}</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Article content"
                          rows={5}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="thumbnail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("thumbnail")}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="https://example.com/image.jpg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="thumbnailFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("thumbnailFile")}</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => field.onChange(e.target.files?.[0])}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {editingId ? t("update") : t("create")}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <Input
        placeholder={t("searchPlaceholder")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 max-w-md"
      />
      {isLoading ? (
        <p>{t("loading")}</p>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-left">{t("title")}</th>
                  <th className="p-2 text-left">{t("author")}</th>
                  <th className="p-2 text-left">{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {data?.payload?.result?.map((article: any) => (
                  <tr key={article._id} className="border-b">
                    <td className="p-2">
                      <div>
                        <h3 className="font-semibold">{article.title}</h3>
                        <p className="text-sm text-gray-600">
                          {article.content.slice(0, 100)}...
                        </p>
                      </div>
                    </td>
                    <td className="p-2">{article.author.name}</td>
                    <td className="p-2 flex gap-2">
                      <Button
                        onClick={() => handleLike(article._id, 1)}
                        variant="outline"
                        size="sm"
                        disabled={likeMutation.isPending}
                      >
                        {t("like")}
                      </Button>
                      <Button
                        onClick={() => handleLike(article._id, -1)}
                        variant="outline"
                        size="sm"
                        disabled={likeMutation.isPending}
                      >
                        {t("dislike")}
                      </Button>
                      <Button
                        onClick={() => handleEdit(article)}
                        variant="outline"
                        size="sm"
                      >
                        {t("edit")}
                      </Button>
                      <Button
                        onClick={() => handleDelete(article._id)}
                        variant="destructive"
                        size="sm"
                        disabled={deleteMutation.isPending}
                      >
                        {t("delete")}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-4 mt-4">
            <Button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              {t("previous")}
            </Button>
            <span>
              {t("pageInfo", {
                page,
                total: data?.payload?.meta?.pages || 1,
              })}
            </span>
            <Button
              onClick={() =>
                setPage((p) => Math.min(p + 1, data?.payload?.meta?.pages || 1))
              }
              disabled={page >= (data?.payload?.meta?.pages || 1)}
            >
              {t("next")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
