// "use client";
// import { useState, useEffect, createContext } from "react";
// import { useQueryClient } from "@tanstack/react-query";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useTranslations } from "next-intl";
// import { useToast } from "@/components/ui/use-toast";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   ColumnDef,
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
// import TableSkeleton from "@/components/Skeleton";
// import { handleErrorApi } from "@/lib/utils";
// import {
//   useGetArticleList,
//   useDeleteArticleMutation,
// } from "@/queries/useArticle";
// import { ArticleType } from "@/schemaValidations/article.schema";
// import EditArticle from "./edit-article";
// import AddArticle from "./add-article";

// const ArticleTableContext = createContext<{
//   idEdit: string | undefined;
//   setIdEdit: (value: string | undefined) => void;
//   articleDelete: ArticleType | null;
//   setArticleDelete: (value: ArticleType | null) => void;
// }>({
//   idEdit: undefined,
//   setIdEdit: () => {},
//   articleDelete: null,
//   setArticleDelete: () => {},
// });

// const PAGE_SIZE = 10;

// function DeleteArticleDialog({
//   articleDelete,
//   setArticleDelete,
//   onSuccess,
// }: {
//   articleDelete: ArticleType | null;
//   setArticleDelete: (value: ArticleType | null) => void;
//   onSuccess?: () => void;
// }) {
//   const t = useTranslations("Articles");
//   const { toast } = useToast();
//   const deleteArticleMutation = useDeleteArticleMutation();

//   const handleDelete = async () => {
//     if (articleDelete) {
//       try {
//         await deleteArticleMutation.mutateAsync(articleDelete._id);
//         toast({ description: t("deleteSuccess") });
//         setArticleDelete(null);
//         onSuccess?.();
//       } catch (error) {
//         handleErrorApi({ error });
//       }
//     }
//   };

//   return (
//     <AlertDialog
//       open={!!articleDelete}
//       onOpenChange={(value) => !value && setArticleDelete(null)}
//     >
//       <AlertDialogContent>
//         <AlertDialogHeader>
//           <AlertDialogTitle>{t("delete")}</AlertDialogTitle>
//           <AlertDialogDescription>
//             {t("confirmDelete")}{" "}
//             <span className="font-bold">{articleDelete?.title}</span>?
//           </AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
//           <AlertDialogAction onClick={handleDelete}>
//             {t("delete")}
//           </AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// }

// export default function Articles() {
//   const t = useTranslations("Articles");
//   const router = useRouter();
//   const { toast } = useToast();
//   const queryClient = useQueryClient();
//   const searchParams = useSearchParams();
//   const page = Number(searchParams.get("page")) || 1;
//   const pageIndex = page - 1;
//   const [pageSize, setPageSize] = useState(PAGE_SIZE);
//   const [idEdit, setIdEdit] = useState<string | undefined>();
//   const [articleDelete, setArticleDelete] = useState<ArticleType | null>(null);

//   const articleListQuery = useGetArticleList(page, pageSize);

//   const data = articleListQuery.data?.payload?.data?.result ?? [];
//   const totalItems = articleListQuery.data?.payload?.data?.meta?.total ?? 0;
//   const totalPages = Math.ceil(totalItems / pageSize);

//   const columns: ColumnDef<ArticleType>[] = [
//     {
//       accessorKey: "_id",
//       header: ({ column }) => (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           {t("id")} <CaretSortIcon className="ml-2 h-4 w-4" />
//         </Button>
//       ),
//     },
//     {
//       accessorKey: "title",
//       header: ({ column }) => (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           {t("title")} <CaretSortIcon className="ml-2 h-4 w-4" />
//         </Button>
//       ),
//       filterFn: (row, columnId, filterValue) =>
//         filterValue
//           ? row
//               .getValue(columnId)
//               .toString()
//               .toLowerCase()
//               .includes(filterValue.toLowerCase())
//           : true,
//     },
//     {
//       accessorKey: "content",
//       header: t("content"),
//       cell: ({ row }) => (
//         <div className="truncate max-w-xs">{row.getValue("content")}</div>
//       ),
//     },
//     {
//       accessorKey: "thumbnail",
//       header: t("thumbnail"),
//       cell: ({ row }) => {
//         const thumbnail = row.getValue("thumbnail") as string | undefined;
//         return thumbnail ? (
//           <img
//             src={thumbnail}
//             alt="Thumbnail"
//             className="h-10 w-10 object-cover"
//           />
//         ) : (
//           "-"
//         );
//       },
//     },
//     {
//       accessorKey: "author",
//       header: t("author"),
//       cell: ({ row }) => {
//         const author = row.getValue("author") as { name: string };
//         return <div>{author.name}</div>;
//       },
//     },
//     {
//       id: "actions",
//       header: t("actions"),
//       cell: ({ row }) => (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" className="h-8 w-8 p-0">
//               <DotsHorizontalIcon className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem onClick={() => setIdEdit(row.original._id)}>
//               {t("edit")}
//             </DropdownMenuItem>
//             <DropdownMenuItem onClick={() => setArticleDelete(row.original)}>
//               {t("delete")}
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       ),
//     },
//   ];

//   const [sorting, setSorting] = useState([]);
//   const [columnFilters, setColumnFilters] = useState([]);
//   const table = useReactTable({
//     data,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     state: { sorting, columnFilters, pagination: { pageIndex, pageSize } },
//     pageCount: totalPages,
//     manualPagination: true,
//   });

//   const goToPage = (newPage: number) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       const params = new URLSearchParams(searchParams.toString());
//       params.set("page", newPage.toString());
//       router.push(`/manage/articles?${params.toString()}`);
//     }
//   };

//   if (articleListQuery.isLoading) return <TableSkeleton />;
//   if (articleListQuery.error) {
//     return <div className="p-4 text-red-500">{t("fetchError")}</div>;
//   }

//   return (
//     <ArticleTableContext.Provider
//       value={{
//         idEdit,
//         setIdEdit,
//         articleDelete,
//         setArticleDelete,
//       }}
//     >
//       <div className="p-4">
//         <DeleteArticleDialog
//           articleDelete={articleDelete}
//           setArticleDelete={setArticleDelete}
//           onSuccess={() => articleListQuery.refetch()}
//         />
//         <div className="flex items-center py-4 gap-5 justify-between">
//           <Input
//             placeholder={t("id")}
//             value={(table.getColumn("title")?.getFilterValue() as string) || ""}
//             onChange={(e) =>
//               table.getColumn("title")?.setFilterValue(e.target.value)
//             }
//             className="max-w-md"
//           />
//           <AddArticle />
//         </div>
//         <div className="rounded-md border">
//           <Table>
//             <TableHeader>
//               {table.getHeaderGroups().map((headerGroup) => (
//                 <TableRow key={headerGroup.id}>
//                   {headerGroup.headers.map((item) => (
//                     <TableHead key={item.id}>
//                       {flexRender(
//                         item.column.columnDef.header,
//                         item.getContext()
//                       )}
//                     </TableHead>
//                   ))}
//                 </TableRow>
//               ))}
//             </TableHeader>
//             <TableBody>
//               {table.getRowModel().rows.length ? (
//                 table.getRowModel().rows.map((row) => (
//                   <TableRow key={row.id}>
//                     {row.getVisibleCells().map((item) => (
//                       <TableCell key={item.id}>
//                         {flexRender(
//                           item.column.columnDef.cell,
//                           item.getContext()
//                         )}
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell
//                     colSpan={columns.length}
//                     className="h-24 text-center"
//                   >
//                     {t("noArticles") || "No articles found."}
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </div>
//         <div className="flex items-center justify-between py-4">
//           <div className="text-xs text-muted-gray">
//             {t("Showing")} <strong>{table.getRowModel().rows.length}</strong>{" "}
//             {t("of")} <strong>{totalItems}</strong> {t("articles")}
//           </div>
//           <div className="flex items-center gap-2">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => goToPage(page - 1)}
//               disabled={page === 1}
//             >
//               {t("Previous")}
//             </Button>
//             <span className="pageSize">
//               {t("Page")} {page} {t("of")} {totalPages}
//             </span>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => goToPage(page + 1)}
//               disabled={page === totalPages}
//             >
//               {t("Next")}
//             </Button>
//             <Select
//               value={pageSize.toString()}
//               onValueChange={(value) => {
//                 setPageSize(Number(value));
//                 goToPage(1);
//               }}
//             >
//               <SelectTrigger className="w-[100px]">
//                 <SelectValue placeholder={t("RowsPerPage")} />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="10">10</SelectItem>
//                 <SelectItem value="20">20</SelectItem>
//                 <SelectItem value="50">50</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>
//       </div>
//     </ArticleTableContext.Provider>
//   );
// }

"use client";
import { useState, useEffect, createContext } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import TableSkeleton from "@/components/Skeleton";
import { handleErrorApi } from "@/lib/utils";
import {
  useGetArticleList,
  useDeleteArticleMutation,
} from "@/queries/useArticle";
import { ArticleType } from "@/schemaValidations/article.schema";
import EditArticle from "./edit-article";
import AddArticle from "./add-article";

const ArticleTableContext = createContext<{
  idEdit: string | undefined;
  setIdEdit: (value: string | undefined) => void;
  articleDelete: ArticleType | null;
  setArticleDelete: (value: ArticleType | null) => void;
}>({
  idEdit: undefined,
  setIdEdit: () => {},
  articleDelete: null,
  setArticleDelete: () => {},
});

const PAGE_SIZE = 10;

function DeleteArticleDialog({
  articleDelete,
  setArticleDelete,
  onSuccess,
}: {
  articleDelete: ArticleType | null;
  setArticleDelete: (value: ArticleType | null) => void;
  onSuccess?: () => void;
}) {
  const t = useTranslations("Articles");
  const { toast } = useToast();
  const deleteArticleMutation = useDeleteArticleMutation();

  const handleDelete = async () => {
    if (articleDelete) {
      try {
        await deleteArticleMutation.mutateAsync(articleDelete._id);
        toast({
          description: t("deleteSuccess", "Article deleted successfully"),
        });
        setArticleDelete(null);
        onSuccess?.();
      } catch (error) {
        handleErrorApi({ error });
      }
    }
  };

  return (
    <AlertDialog
      open={!!articleDelete}
      onOpenChange={(value) => !value && setArticleDelete(null)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("delete", "Delete Article")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("confirmDelete", "Are you sure you want to delete the article")}{" "}
            <span className="font-bold">{articleDelete?.title}</span>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel", "Cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            {t("delete", "Delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function Articles() {
  const t = useTranslations("Articles");
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const pageIndex = page - 1;
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [idEdit, setIdEdit] = useState<string | undefined>();
  const [articleDelete, setArticleDelete] = useState<ArticleType | null>(null);

  const articleListQuery = useGetArticleList(page, pageSize);

  const data = articleListQuery.data?.payload?.data?.result ?? [];
  const totalItems = articleListQuery.data?.payload?.data?.meta?.total ?? 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  const columns: ColumnDef<ArticleType>[] = [
    {
      accessorKey: "_id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("id", "Articles.id")} <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("title", "Article Title")}{" "}
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      filterFn: (row, columnId, filterValue) =>
        filterValue
          ? row
              .getValue(columnId)
              .toString()
              .toLowerCase()
              .includes(filterValue.toLowerCase())
          : true,
    },
    {
      accessorKey: "content",
      header: t("content", "Content"),
      cell: ({ row }) => (
        <div className="truncate max-w-xs">{row.getValue("content")}</div>
      ),
    },
    {
      accessorKey: "thumbnail",
      header: t("thumbnail", "Thumbnail URL"),
      cell: ({ row }) => {
        const thumbnail = row.getValue("thumbnail") as string | undefined;
        return thumbnail ? (
          <img
            src={thumbnail}
            alt="Thumbnail"
            className="h-10 w-10 object-cover"
          />
        ) : (
          "-"
        );
      },
    },
    {
      accessorKey: "author",
      header: t("author", "Author"),
      cell: ({ row }) => {
        const author = row.getValue("author") as { name: string };
        return <div>{author.name}</div>;
      },
    },
    {
      id: "actions",
      header: t("actions", "Actions"),
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t("actions", "Actions")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIdEdit(row.original._id)}>
              {t("edit", "Edit Article")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setArticleDelete(row.original)}>
              {t("delete", "Delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, columnFilters, pagination: { pageIndex, pageSize } },
    pageCount: totalPages,
    manualPagination: true,
  });

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", newPage.toString());
      router.push(`/manage/articles?${params.toString()}`);
    }
  };

  if (articleListQuery.isLoading) return <TableSkeleton />;
  if (articleListQuery.error) {
    return (
      <div className="p-4 text-red-500">
        {t("fetchError", "Failed to load articles")}
      </div>
    );
  }

  return (
    <ArticleTableContext.Provider
      value={{
        idEdit,
        setIdEdit,
        articleDelete,
        setArticleDelete,
      }}
    >
      <div className="p-4">
        <DeleteArticleDialog
          articleDelete={articleDelete}
          setArticleDelete={setArticleDelete}
          onSuccess={() => articleListQuery.refetch()}
        />
        <div className="flex items-center py-4 gap-5 justify-between">
          <Input
            placeholder={t("id", "Search by title...")}
            value={(table.getColumn("title")?.getFilterValue() as string) || ""}
            onChange={(e) =>
              table.getColumn("title")?.setFilterValue(e.target.value)
            }
            className="max-w-md"
          />
          <AddArticle />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((item) => (
                    <TableHead key={item.id}>
                      {flexRender(
                        item.column.columnDef.header,
                        item.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((item) => (
                      <TableCell key={item.id}>
                        {flexRender(
                          item.column.columnDef.cell,
                          item.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {t("noArticles", "No articles found")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between py-4">
          <div className="text-xs text-muted-gray">
            {t("Showing", "Showing")}{" "}
            <strong>{table.getRowModel().rows.length}</strong> {t("of", "of")}{" "}
            <strong>{totalItems}</strong> {t("articles", "articles")}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
            >
              {t("Previous", "Previous")}
            </Button>
            <span className="pageSize">
              {t("Page", "Page")} {page} {t("of", "of")} {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
            >
              {t("Next", "Next")}
            </Button>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                setPageSize(Number(value));
                goToPage(1);
              }}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder={t("RowsPerPage", "Rows per page")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </ArticleTableContext.Provider>
  );
}
