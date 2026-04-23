import urls from "./urls";
import axios from "./axios-interceptor";

export function uploadSingleFile(formData: FormData) {
  return axios({
    url: urls.uploadSingleFile.url,
    method: urls.uploadSingleFile.method,
    data: formData,
  });
}

export function uploadMultipleFiles(formData: FormData) {
  return axios({
    url: urls.uploadMultipleFiles.url,
    method: urls.uploadMultipleFiles.method,
    data: formData,
  });
}

async function uploadMultipleFilesInstance(fileInstace: File[]) {
  const formData = new FormData();
  fileInstace.forEach((file) => {
    formData.append("files", file);
  });

  try {
    const response = await uploadMultipleFiles(formData);
    const res = response?.data?.data;
    return res;
  } catch (error) {
    return error;
  }
}

async function uploadSingleFileInstance(fileInstace: File) {
  const formData = new FormData();
  formData.append("file", fileInstace);
  try {
    const response = await uploadSingleFile(formData);
    const res = response?.data?.data;
    return res;
  } catch (error) {
    return error;
  }
}

export function uploadFiles(
  fileInstace: File | File[],
  multiple: boolean = false
) {
  if (multiple) {
    return uploadMultipleFilesInstance(fileInstace as File[]);
  } else {
    return uploadSingleFileInstance(fileInstace as File);
  }
}
