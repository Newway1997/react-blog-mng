import request from "./request";

export function checkLogin(userName, password) {
  return request({
    url: "/checkLogin",
    method: "post",
    data: { userName, password },
    withCredentials: true
  });
}
export function getTypeInfo() {
  return request({
    url: "/getTypeInfo",
    method: "get",
    withCredentials: true
  });
}
export function addArticle(data) {
  return request({
    url: "/addArticle",
    method: "post",
    data,
    withCredentials: true
  });
}
export function updateArticle(data) {
  return request({
    url: "/updateArticle",
    method: "post",
    data,
    withCredentials: true
  });
}
export function getArticleList() {
  return request({
    url: "/getArticleList",
    method: "get",
    withCredentials: true
  });
}
export function deleteArticle(id) {
  return request({
    url: "/deleteArticle/" + id,
    method: "get",
    withCredentials: true
  });
}
export function getArticleById(id) {
  return request({
    url: "/getArticleById/" + id,
    method: "get",
    withCredentials: true
  });
}
