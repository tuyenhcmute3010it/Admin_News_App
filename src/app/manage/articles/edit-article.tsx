"use client";
import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Loader2 } from "lucide-react";
import { useGetArticle, useUpdateArticleMutation } from "@/queries/useArticle";
import {
  UpdateArticleBody,
  UpdateArticleBodyType,
} from "@/schemaValidations/article.schema";
import { handleErrorApi } from "@/lib/utils";

type EditArticleProps = {
  id: string;
  setId: (value: string | undefined) => void;
  onSubmitSuccess?: () => void;
};

export default function EditArticle({
  id,
  setId,
  onSubmitSuccess,
}: EditArticleProps) {
  const t = useTranslations("Articles");
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const articleId = id || searchParams.get("id");
  const [open, setOpen] = useState(!!articleId);

  const { data, isLoading, error } = useGetArticle({
    id: articleId,
    enabled: !!articleId,
  });
  const updateArticleMutation = useUpdateArticleMutation();

  const form = useForm<UpdateArticleBodyType>({
    resolver: zodResolver(UpdateArticleBody),
    defaultValues: {
      title: "",
      content: "",
      thumbnail: "",
    },
  });
  console.log("asdasdasdasdasdasdasdas", data);

  useEffect(() => {
    if (data?.payload.data) {
      const { title, content, thumbnail } = data.payload.data;
      form.reset({
        title,
        content,
        thumbnail: thumbnail || "",
      });
    }
  }, [data, form]);

  const onSubmit = async (values: UpdateArticleBodyType) => {
    if (updateArticleMutation.isPending) return;
    try {
      await updateArticleMutation.mutateAsync({ id: articleId, ...values });
      toast({
        title: t("updateSuccess", "Update Successful"),
        description: t("articleUpdated", "Article {title} has been updated", {
          title: values.title,
        }),
      });
      setOpen(false);
      setId(undefined);
      onSubmitSuccess?.();
      router.push("/manage/articles");
    } catch (error) {
      handleErrorApi({ error, setError: form.setError });
      toast({
        title: t("updateFailed", "Update Failed"),
        description: t(
          "errorGeneric",
          "An error occurred while updating the article"
        ),
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">{t("loading", "Loading...")}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        {t("fetchError", "Failed to load article.")}
      </div>
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) {
          setId(undefined);
          form.reset();
          router.push("/manage/articles");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 gap-1">
          {t("edit", "Edit Article")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1200px] h-[700px] overflow-auto">
        <DialogHeader>
          <DialogTitle>{t("update", "Update Article")}</DialogTitle>
          <DialogDescription>
            {t("updateDescription", "Edit the details of the article below.")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            id="edit-article-form"
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("title", "Title")}</FormLabel>
                  <FormControl>
                    <Input
                      id="title"
                      placeholder={t(
                        "titlePlaceholder",
                        "Enter the article title"
                      )}
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
              render={({ field }) => {
                const editorRef = useRef<any>(null);
                return (
                  <FormItem>
                    <FormLabel>{t("content", "Content")}</FormLabel>
                    <FormControl>
                      <Editor
                        apiKey="2ago0pjy5jsyi0eajfrx6ftefx6f8u2zvv2uubbi0m3dp3xo"
                        onInit={(evt, editor) => (editorRef.current = editor)}
                        value={field.value}
                        onEditorChange={(content) => field.onChange(content)}
                        init={{
                          height: 500,
                          menubar: true,
                          plugins: [
                            "advlist autolink lists link image charmap print preview anchor",
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
                );
              }}
            />
            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("thumbnail", "Thumbnail")}</FormLabel>
                  <FormControl>
                    <Input
                      id="thumbnail"
                      placeholder={t(
                        "thumbnailPlaceholder",
                        "Enter the thumbnail URL (e.g., https://example.com/image.jpg)"
                      )}
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
            form="edit-article-form"
            disabled={updateArticleMutation.isPending}
          >
            {updateArticleMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("submitting", "Submitting...")}
              </>
            ) : (
              t("update", "Update Article")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
