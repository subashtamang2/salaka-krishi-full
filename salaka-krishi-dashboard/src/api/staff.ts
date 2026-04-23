import urls from "./urls";
import axios from "./axios-interceptor";
import { UserInterface } from "schema/schema";

export function getCurrentUser() {
  return axios({
    url: urls.currentStaff.url,
    method: urls.currentStaff.method,
  });
}
export function updateUser(id: string, payload: UserInterface) {
  const url = urls.updatedCurrentUser.url.replace(":id", id);
  return axios({
    url,
    method: urls.updatedCurrentUser.method,
    data: payload,
  });
}

export function createUser(payload: UserInterface) {
  return axios({
    url: urls.createStaff.url,
    method: urls.createStaff.method,
    data: payload,
  });
}

export function getUsers() {
  return axios({
    url: urls.getStaffs.url,
    method: urls.getStaffs.method,
  });
}

export function deleteUser(id: string) {
  const url = urls.deleteStaff.url.replace(":id", id);
  return axios({
    url,
    method: urls.deleteStaff.method,
  });
}
