import type { UseQueryResult } from "@tanstack/react-query";

export interface Record {
  id: number,
  temperature: number,
  username: string | null,
  uploaded_at: Date
};

export interface RecordTableColumn {
  name: string,
  uid: string
};

export type UserTableColumn = RecordTableColumn;

export interface User {
  id: number,
  username: string,
  password: string,
  role: string
};

export type UserWithoutPassword = Omit<User, "password">;

export interface IconSvgProps {
  width?: number,
  height?: number,
  size?: number,
  strokeWidth?: number,
  fill?: string,
  className?: string,
  [key: string]: any
};

export interface CreateRecordMutationResponse {
  message: string,
  status: number
};

export interface CreateRecordMutationVariables {
  temperature: number,
  uploaded_by: number
};

export interface UpdateRecordMutationResponse {
  message: string
  status: number
};

export interface UpdateRecordMutationVariables {
  id: number,
  temperature: number
};

export interface DeleteRecordMutationResponse {
  message: string,
  status: number
};

export interface DeleteRecordMutationVariables {
  id: number
};

export interface CreateUserMutationResponse {
  message: string,
  status: number
};

export interface CreateUserMutationVariables {
  username: string,
  password: string
};

export interface UpdateUserMutationResponse {
  message: string,
  status: number
};

export interface UpdateUserMutationVariables {
  id: number,
  username: string,
  password: string
};

export interface DeleteUserMutationResponse {
  message: string,
  status: number
};

export interface DeleteUserMutationVariables {
  id: number
};

export interface LoginMutationVariables {
  username: string,
  password: string
};

export type LoginMutationResponse = UserWithoutPassword;

export type UserQuery = UseQueryResult<UserWithoutPassword | null, Error>

export type RegisterMutationResponse = LoginMutationResponse;
export type RegisterMutationVariables = LoginMutationVariables;

export type TrendCardProps = {
  title: string;
  value: string;
  isLoading: boolean;
};
