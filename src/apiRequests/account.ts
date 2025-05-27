// src/apiRequests/user.ts
import http from "@/lib/http";
import {
  UserListResType,
  UserResType,
  CreateUserBodyType,
  UpdateUserBodyType,
  UpdatePasswordBodyType,
} from "@/schemaValidations/account.schema";

const prefix = "/api/v1/users";
const filePrefix = "/api/v1/files";

export interface UserProfileResponse {
  status: number;
  message: string;
  payload: {
    data: {
      _id: string;
      email: string;
      name: string;
      phone: string;
      avatar: string;
      role: string;
      permissions: Array<{
        module: string;
        method: string;
      }>;
    };
  };
}

export interface FileUploadResponse {
  payload: {
    data: {
      fileName: string;
      uploadedAt: string;
    };
  };
}

const userApiRequest = {
  list: (page: number = 1, size: number = 10) =>
    http.get<UserListResType>(`${prefix}?current=${page}&pageSize=${size}`),
  add: async (body: CreateUserBodyType, avatarFile?: File) => {
    let avatarUrl: string | undefined;
    if (avatarFile) {
      const formData = new FormData();
      formData.append("file", avatarFile);
      formData.append("folder", "avatars");
      const uploadResult = await http.post<FileUploadResponse>(
        filePrefix,
        formData
      );
      avatarUrl = `/upload/avatars/${uploadResult.payload.data.fileName}`;
    }
    const { confirmPassword, ...requestBody } = body;
    return http.post<UserResType>(prefix, {
      ...requestBody,
      avatar: avatarUrl || "default-avatar.jpg",
    });
  },
  update: async (id: string, body: UpdateUserBodyType, avatarFile?: File) => {
    let avatarUrl: string | undefined = body.avatar;
    if (avatarFile) {
      const formData = new FormData();
      formData.append("file", avatarFile);
      formData.append("folder", "avatars");
      const uploadResult = await http.post<FileUploadResponse>(
        filePrefix,
        formData
      );
      avatarUrl = `/upload/avatars/${uploadResult.payload.data.fileName}`;
    }
    return http.put<UserResType>(prefix, {
      _id: id,
      ...body,
      avatar: avatarUrl,
    });
  },
  updatePassword: (body: UpdatePasswordBodyType) =>
    http.post<UserResType>(`${prefix}/password`, body),
  get: (id: string) => http.get<UserResType>(`${prefix}/${id}`),
  delete: (id: string) => http.delete<UserResType>(`${prefix}/${id}`),
  me: () => http.get<UserProfileResponse>("/api/v1/auth/profile"),
};

export default userApiRequest;
