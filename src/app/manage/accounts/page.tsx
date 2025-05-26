// src/app/accounts/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useGetAccountList,
  useAddAccountMutation,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
} from "@/queries/useAccount";
import { useAppContext } from "@/components/app-provider";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateEmployeeAccountBody,
  CreateEmployeeAccountBodyType,
  UpdateEmployeeAccountBodyType,
} from "@/schemaValidations/account.schema";
import { toast } from "@/components/ui/use-toast";

export default function Accounts() {
  const { isAuth, permissions } = useAppContext();
  const router = useRouter();
  const t = useTranslations("Accounts");
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { data, isLoading } = useGetAccountList(page, 10);
  const addMutation = useAddAccountMutation();
  const updateMutation = useUpdateAccountMutation();
  const deleteMutation = useDeleteAccountMutation();

  const form = useForm<CreateEmployeeAccountBodyType>({
    resolver: zodResolver(CreateEmployeeAccountBody),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      avatar: "",
      phoneNumber: "",
      citizenId: "",
    },
  });

  const onSubmit = async (data: CreateEmployeeAccountBodyType) => {
    try {
      if (editingId) {
        const updateData: UpdateEmployeeAccountBodyType = {
          email: data.email,
          fullName: data.fullName,
          avatar: data.avatar,
          phoneNumber: data.phoneNumber,
          citizenId: data.citizenId,
          changePassword: !!data.password,
          password: data.password,
          confirmPassword: data.confirmPassword,
        };
        await updateMutation.mutateAsync({ id: editingId, body: updateData });
        toast({ description: t("updateSuccess") });
      } else {
        await addMutation.mutateAsync({ body: data });
        toast({ description: t("addSuccess") });
      }
      form.reset();
      setEditingId(null);
    } catch (error) {
      toast({ variant: "destructive", description: t("addError") });
    }
  };

  const handleEdit = (account: any) => {
    setEditingId(account.userId);
    form.setValue("email", account.email);
    form.setValue("fullName", account.fullName);
    form.setValue("avatar", account.avatar || "");
    form.setValue("phoneNumber", account.phoneNumber || "");
    form.setValue("citizenId", account.citizenId || "");
  };

  const handleDelete = (id: number) => {
    if (confirm(t("confirmDelete"))) {
      deleteMutation.mutate(id);
    }
  };

  useEffect(() => {
    if (!isAuth) router.push("/login");
  }, [isAuth, router]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{t("title")}</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mb-6 grid gap-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("email")}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="example@railskylines.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("fullName")}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="John Doe" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("password")}</FormLabel>
                <FormControl>
                  <Input type="password" {...field} placeholder="******" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("confirmPassword")}</FormLabel>
                <FormControl>
                  <Input type="password" {...field} placeholder="******" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="avatar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("avatar")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("phoneNumber")}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="+1234567890" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="citizenId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("citizenId")}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="123456789" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={addMutation.isPending || updateMutation.isPending}
          >
            {editingId ? t("updateAccount") : t("addAccount")}
          </Button>
        </form>
      </Form>
      {isLoading ? (
        <p>{t("loading")}</p>
      ) : (
        <div className="space-y-4">
          {data?.payload?.data?.result?.map((account) => (
            <div
              key={account.userId}
              className="p-4 bg-gray-100 rounded-lg flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold">{account.fullName}</h3>
                <p className="text-sm">{account.email}</p>
                {account.phoneNumber && (
                  <p className="text-sm">
                    {t("phone")}: {account.phoneNumber}
                  </p>
                )}
                {account.citizenId && (
                  <p className="text-sm">
                    {t("citizenId")}: {account.citizenId}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleEdit(account)} variant="outline">
                  {t("edit")}
                </Button>

                <Button
                  onClick={() => handleDelete(account.userId)}
                  variant="destructive"
                >
                  {t("delete")}
                </Button>
              </div>
            </div>
          ))}
          <div className="flex gap-4 mt-4">
            <Button
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              disabled={page === 0}
            >
              {t("previous")}
            </Button>
            <span>
              {t("pageInfo", {
                page: page + 1,
                total: data?.payload?.data?.meta?.pages || 1,
              })}
            </span>
            <Button
              onClick={() =>
                setPage((p) =>
                  Math.min(p + 1, (data?.payload?.data?.meta?.pages || 1) - 1)
                )
              }
              disabled={page >= (data?.payload?.data?.meta?.pages || 1) - 1}
            >
              {t("next")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
