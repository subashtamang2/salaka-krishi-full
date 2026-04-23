import { Category, CategoryUpdate } from "schema/category";
import axios from "./axios-interceptor";
import urls from "./urls";

export function createCategory(payload: Category) {
  return axios({
    url: urls.createCategory.url,
    method: urls.createCategory.method,
    data: payload,
  });
}

export function getCategories() {
  return axios({
    url: urls.getCategories.url,
    method: urls.getCategories.method,
  });
}

export function deleteCategory(id: string) {
  const url = urls.deleteCategory.url.replace(":id", id);
  return axios({
    url: url,
    method: urls.deleteCategory.method,
  });
}

export function getCategoryById(id: string) {
  const url = urls.getSingleCategory.url.replace(":id", id);
  return axios({
    url: url,
    method: urls.getSingleCategory.method,
  });
}

export function updateCategory(id: string, payload: CategoryUpdate) {
  const url = urls.updateCategory.url.replace(":id", id);
  return axios({
    url: url,
    method: urls.updateCategory.method,
    data: payload,
  });
}
