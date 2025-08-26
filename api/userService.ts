import axios from "./axios";
import { User } from "../types/user";

export const getUser = (id: string) => axios.get<User>(`/api/v1/users/${id}`);
export const updateUser = (data: Partial<User>) => axios.patch("/api/v1/users/me/update", data);
