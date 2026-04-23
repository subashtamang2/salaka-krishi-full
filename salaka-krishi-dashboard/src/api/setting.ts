import urls from "./urls";
import axios from "./axios-interceptor";
import { SettingInterface, SocialmediaInterface } from "schema/setting";

export function getSiteInfo() {
  return axios({
    url: urls.siteInfo.url,
    method: urls.siteInfo.method,
  });
}

export function addSiteInfo(data: SettingInterface) {
  return axios({
    url: urls.addSiteInfo.url,
    method: urls.addSiteInfo.method,
    data,
  });
}

export function addSocialmedia(data: SocialmediaInterface) {
  return axios({
    url: urls.addSocialmedial.url,
    method: urls.addSocialmedial.method,
    data,
  });
}

export function getSocialmedia() {
  return axios({
    url: urls.getSocialmedial.url,
    method: urls.getSocialmedial.method,
  });
}
