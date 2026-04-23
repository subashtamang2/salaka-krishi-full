import { BlogUpdatePayload, CreateBlogPayload } from "schema/blog";
import urls from "./urls";
import axios from "./axios-interceptor";

export function createBlog(payload: CreateBlogPayload) {
  return axios({
    url: urls.createBlog.url,
    method: urls.createBlog.method,
    data: payload,
  });
}

export function getBlogs() {
  return axios({
    url: urls.getBlogs.url,
    method: urls.getBlogs.method,
  });
}

export function deleteBlog(id: string) {
  const url = urls.deleteBlog.url.replace(":id", id);
  return axios({
    url,
    method: urls.deleteBlog.method,
  });
}

export function getBlogById(id: string) {
  const url = urls.getSingleBlog.url.replace(":id", id);
  return axios({
    url,
    method: urls.getSingleBlog.method,
  });
}

export function updateBlog(id: string, payload: BlogUpdatePayload) {
  const url = urls.updateBlog.url.replace(":id", id);
  return axios({
    url,
    method: urls.updateBlog.method,
    data: payload,
  });
}
