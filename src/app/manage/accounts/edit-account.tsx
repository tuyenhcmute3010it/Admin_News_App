// src/app/manage/users/edit-user.tsx
"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { handleErrorApi } from "@/lib/utils";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Upload, Loader2 } from "lucide-react";
import {
  UpdateUserBodyType,
  UpdateUserBody,
} from "@/schemaValidations/account.schema";
import { useGetUser, useUpdateUserMutation } from "@/queries/useAccount";

type EditUserProps = {
  id: string;
  setId: (value: string | undefined) => void;
  onSubmitSuccess?: () => void;
};

export default function EditUser({
  id,
  setId,
  onSubmitSuccess,
}: EditUserProps) {
  const t = useTranslations("ManageUsers");
  const [open, setOpen] = useState(!!id);
  const [file, setFile] = useState<File | undefined>();
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();

  const { data, isLoading } = useGetUser({ id, enabled: !!id });
  const updateUserMutation = useUpdateUserMutation();

  const form = useForm<UpdateUserBodyType>({
    resolver: zodResolver(UpdateUserBody),
    defaultValues: {
      name: "",
      phone: "",
      avatar: "",
    },
  });

  useEffect(() => {
    if (data?.payload.data) {
      const { name, phone, avatar } = data.payload.data;
      form.reset({ name, phone, avatar });
      setPreviewUrl(avatar || "/default-avatar.jpg");
    }
  }, [data, form]);

  const avatar = form.watch("avatar");
  const name = form.watch("name");

  const previewAvatar = useMemo(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return url;
    }
    return avatar || "/default-avatar.jpg";
  }, [file, avatar]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const reset = () => {
    form.reset();
    setFile(undefined);
    setPreviewUrl(undefined);
    setId(undefined);
    if (avatarInputRef.current) avatarInputRef.current.value = "";
  };

  const onSubmit = async (values: UpdateUserBodyType) => {
    if (updateUserMutation.isPending) return;
    try {
      await updateUserMutation.mutateAsync({
        id,
        body: values,
        avatarFile: file,
      });
      toast({
        description: t("UpdateSuccess", { email: data?.payload.data.email }),
      });
      reset();
      setOpen(false);
      onSubmitSuccess?.();
    } catch (error) {
      handleErrorApi({ error, setError: form.setError });
      toast({
        description: t("UpdateError"),
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">{t("Loading")}</span>
      </div>
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) reset();
      }}
    >
      <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>{t("UpdateUser")}</DialogTitle>
          <DialogDescription>{t("UpdateDescription")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="edit-user-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 items-start justify-start">
                    <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
                      <AvatarImage src={previewAvatar} />
                      <AvatarFallback>{name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <input
                      type="file"
                      accept="image/*"
                      ref={avatarInputRef}
                      onChange={(e) => {
                        const selectedFile = e.target.files?.[0];
                        if (selectedFile) {
                          if (selectedFile.size > 5 * 1024 * 1024) {
                            form.setError("avatar", {
                              message: t("FileTooLarge"),
                            });
                            return;
                          }
                          if (!selectedFile.type.startsWith("image/")) {
                            form.setError("avatar", {
                              message: t("InvalidFileType"),
                            });
                            return;
                          }
                          setFile(selectedFile);
                          field.onChange(URL.createObjectURL(selectedFile));
                        }
                      }}
                      className="hidden"
                    />
                    <button
                      type="button"
                      className="flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed"
                      onClick={() => avatarInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 text-muted-foreground" />
                      <span className="sr-only">{t("UploadAvatar")}</span>
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Label>{t("Name")}</Label>
                  <Input placeholder={t("NamePlaceholder")} {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <Label>{t("Phone")}</Label>
                  <Input placeholder={t("PhonePlaceholder")} {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            type="submit"
            form="edit-user-form"
            disabled={updateUserMutation.isPending}
          >
            {updateUserMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("Submitting")}
              </>
            ) : (
              t("Update")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
