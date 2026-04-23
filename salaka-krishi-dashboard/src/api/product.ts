import { CreateProductSchema, UpdateProductSchema } from "schema/product";
import axios from "./axios-interceptor";
import urls from "./urls";

export function createProduct(data: CreateProductSchema) {
  return axios({
    url: urls.createProducts.url,
    method: urls.createProducts.method,
    data,
  });
}

export function getProducts() {
  return axios({
    url: urls.getProducts.url,
    method: urls.getProducts.method,
  });
}

export function getProductsByQuery(params: any) {
  return axios({
    url: urls.queryProducts.url,
    method: urls.queryProducts.method,
    params,
  });
}

export function deleteProduct(id: string) {
  const url = urls.deleteProduct.url.replace(":id", id);
  return axios({
    url,
    method: urls.deleteProduct.method,
  });
}

export function getSingleProduct(id: string) {
  const url = urls.getSingleProduct.url.replace(":id", id);
  return axios({
    url,
    method: urls.getSingleProduct.method,
  });
}

export function updateProduct(id: string, data: UpdateProductSchema) {
  const url = urls.updateProduct.url.replace(":id", id);
  return axios({
    url,
    method: urls.updateProduct.method,
    data,
  });
}


export function getFilteredProducts(filterType: string) {
  const url = urls.getFilteredProducts.url.replace(":filterType", filterType);

  return axios({
    url,
    method: urls.getFilteredProducts.method,
  });
}
