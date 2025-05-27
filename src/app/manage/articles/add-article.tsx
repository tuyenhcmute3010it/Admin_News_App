// // src/app/articles/page.tsx
// "use client";
// import { useState, useEffect } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { useAppContext } from "@/components/app-provider";
// import { useRouter } from "next/navigation";
// import { useTranslations } from "next-intl";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage,
// } from "@/components/ui/form";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "@/components/ui/use-toast";
// import { z } from "zod";
// import {
//   deleteArticle,
//   getArticles,
//   createArticle,
//   updateArticle,
//   toggleLike,
// } from "@/apiRequests/article";

// // Article schema for form validation
// const ArticleSchema = z.object({
//   title: z.string().min(1, "Title is required"),
//   content: z.string().min(1, "Content is required"),
//   thumbnail: z.string().url("Invalid URL").optional(),
// });

// type ArticleFormType = z.infer<typeof ArticleSchema>;

// export default function Articles() {
//   const { isAuth, permissions } = useAppContext();
//   const router = useRouter();
//   const t = useTranslations("Articles");
//   const queryClient = useQueryClient();
//   const [page, setPage] = useState(1);
//   const [search, setSearch] = useState("");
//   const [editingId, setEditingId] = useState<string | null>(null);

//   const { data, isLoading } = useQuery({
//     queryKey: ["articles", page, search],
//     queryFn: () => getArticles(page, 10, search),
//     enabled: isAuth,
//   });

//   const createMutation = useMutation({
//     mutationFn: createArticle,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["articles"] });
//       form.reset();
//       toast({ description: t("createSuccess") });
//     },
//     onError: () =>
//       toast({ variant: "destructive", description: t("createError") }),
//   });

//   const updateMutation = useMutation({
//     mutationFn: ({ id, data }: { id: string; data: ArticleFormType }) =>
//       updateArticle(id, data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["articles"] });
//       form.reset();
//       setEditingId(null);
//       toast({ description: t("updateSuccess") });
//     },
//     onError: () =>
//       toast({ variant: "destructive", description: t("updateError") }),
//   });

//   const deleteMutation = useMutation({
//     mutationFn: deleteArticle,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["articles"] });
//       toast({ description: t("deleteSuccess") });
//     },
//     onError: () =>
//       toast({ variant: "destructive", description: t("deleteError") }),
//   });

//   const likeMutation = useMutation({
//     mutationFn: ({
//       articleId,
//       quantity,
//     }: {
//       articleId: string;
//       quantity: 1 | -1;
//     }) => toggleLike(articleId, quantity),
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["articles"] }),
//     onError: () =>
//       toast({ variant: "destructive", description: t("likeError") }),
//   });

//   const form = useForm<ArticleFormType>({
//     resolver: zodResolver(ArticleSchema),
//     defaultValues: {
//       title: "",
//       content: "",
//       thumbnail: "",
//     },
//   });

//   const onSubmit = async (data: ArticleFormType) => {
//     if (editingId) {
//       updateMutation.mutate({ id: editingId, data });
//     } else {
//       createMutation.mutate(data);
//     }
//   };

//   const handleEdit = (article: any) => {
//     setEditingId(article._id);
//     form.setValue("title", article.title);
//     form.setValue("content", article.content);
//     form.setValue("thumbnail", article.thumbnail || "");
//   };

//   const handleDelete = (id: string) => {
//     if (confirm(t("confirmDelete"))) {
//       deleteMutation.mutate(id);
//     }
//   };

//   const handleLike = (articleId: string, quantity: 1 | -1) => {
//     likeMutation.mutate({ articleId, quantity });
//   };

//   useEffect(() => {
//     if (!isAuth) router.push("/login");
//   }, [isAuth, router]);

//   return (
//     <div>
//       <h1 className="text-3xl font-bold mb-4">{t("title")}</h1>
//       <Input
//         placeholder={t("searchPlaceholder")}
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="mb-4"
//       />
//       <Form {...form}>
//         <form
//           onSubmit={form.handleSubmit(onSubmit)}
//           className="mb-6 grid gap-4"
//         >
//           <FormField
//             control={form.control}
//             name="title"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>{t("title")}</FormLabel>
//                 <FormControl>
//                   <Input {...field} placeholder="Article title" />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="content"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>{t("content")}</FormLabel>
//                 <FormControl>
//                   <Textarea {...field} placeholder="Article content" rows={5} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="thumbnail"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>{t("thumbnail")}</FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     placeholder="https://example.com/image.jpg"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <Button
//             type="submit"
//             disabled={createMutation.isPending || updateMutation.isPending}
//           >
//             {editingId ? t("update") : t("create")}
//           </Button>
//         </form>
//       </Form>
//       {isLoading ? (
//         <p>{t("loading")}</p>
//       ) : (
//         <div className="space-y-4">
//           {data?.payload?.result?.map((article: any) => (
//             <div
//               key={article._id}
//               className="p-4 bg-gray-100 rounded-lg flex justify-between items-center"
//             >
//               <div>
//                 <h3 className="text-lg font-semibold">{article.title}</h3>
//                 <p className="text-sm text-gray-600">
//                   {article.content.slice(0, 100)}...
//                 </p>
//                 <p className="text-sm">
//                   {t("by", { name: article.author.name })}
//                 </p>
//               </div>
//               <div className="flex gap-2">
//                 <>
//                   <Button
//                     onClick={() => handleLike(article._id, 1)}
//                     variant="outline"
//                     disabled={likeMutation.isPending}
//                   >
//                     {t("like")}
//                   </Button>
//                   <Button
//                     onClick={() => handleLike(article._id, -1)}
//                     variant="outline"
//                     disabled={likeMutation.isPending}
//                   >
//                     {t("dislike")}
//                   </Button>
//                 </>

//                 <Button onClick={() => handleEdit(article)} variant="outline">
//                   {t("edit")}
//                 </Button>

//                 <Button
//                   onClick={() => handleDelete(article._id)}
//                   variant="destructive"
//                   disabled={deleteMutation.isPending}
//                 >
//                   {t("delete")}
//                 </Button>
//               </div>
//             </div>
//           ))}
//           <div className="flex gap-4 mt-4">
//             <Button
//               onClick={() => setPage((p) => Math.max(p - 1, 1))}
//               disabled={page === 1}
//             >
//               {t("previous")}
//             </Button>
//             <span>
//               {t("pageInfo", {
//                 page,
//                 total: data?.payload?.meta?.pages || 1,
//               })}
//             </span>
//             <Button
//               onClick={() =>
//                 setPage((p) => Math.min(p + 1, data?.payload?.meta?.pages || 1))
//               }
//               disabled={page >= (data?.payload?.meta?.pages || 1)}
//             >
//               {t("next")}
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// src/app/manage/articles/add-article.tsx
"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Editor } from "@tinymce/tinymce-react";
import { useAddArticleMutation } from "@/queries/useArticle";
import {
  CreateArticleBody,
  CreateArticleBodyType,
} from "@/schemaValidations/article.schema";
import { handleErrorApi } from "@/lib/utils";
import { Loader2, PlusCircle } from "lucide-react";

export default function AddArticle() {
  const t = useTranslations("Articles");
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const addArticleMutation = useAddArticleMutation();

  const form = useForm<CreateArticleBodyType>({
    resolver: zodResolver(CreateArticleBody),
    defaultValues: {
      title: "",
      content: "",
      thumbnail: "",
    },
  });

  const onSubmit = async (data: CreateArticleBodyType) => {
    try {
      await addArticleMutation.mutateAsync(data);
      toast({ description: t("createSuccess") });
      setOpen(false);
      form.reset();
    } catch (error) {
      handleErrorApi({ error, setError: form.setError });
      toast({ variant: "destructive", description: t("createError") });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span>{t("create")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1200px] h-[700px] overflow-auto">
        <DialogHeader>
          <DialogTitle>{t("create")}</DialogTitle>
          <DialogDescription>{t("createDescription")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            id="add-article-form"
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("title")}</FormLabel>
                  <FormControl>
                    <Input
                      id="title"
                      placeholder={t("titlePlaceholder")}
                      {...field}
                    />
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
                    <Editor
                      apiKey="2ago0pjy5jsyi0eajfrx6ftefx6f8u2zvv2uubbi0m3dp3xo"
                      value={field.value}
                      onEditorChange={(content) => field.onChange(content)}
                      init={{
                        height: 500,
                        menubar: true,
                        plugins: [
                          "advlist autolink lists link image charmap",
                          "searchreplace visualblocks code fullscreen",
                          "insertdatetime media table paste code help wordcount",
                        ],
                        toolbar:
                          "undo redo | formatselect | bold italic backcolor | " +
                          "alignleft aligncenter alignright alignjustify | " +
                          "bullist numlist outdent indent | removeformat | help",
                        content_style:
                          "body { font-family:Arial,sans-serif; font-size:14px }",
                      }}
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
                      id="thumbnail"
                      placeholder={
                        t("thumbnailPlaceholder") ||
                        "https://example.com/image.jpg"
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            type="submit"
            form="add-article-form"
            disabled={addArticleMutation.isPending}
          >
            {addArticleMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("submitting")}
              </>
            ) : (
              t("create")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
