import request from "./request";
export function getAdverts() {
  return request({
    url: "/getAdverts",
    method: "get",
    withCredentials: true
  });
}
export function deleteAdvert(id) {
  return request({
    url: "/deleteAdvert/" + id,
    method: "delete",
    withCredentials: true
  });
}
export function addAdvert(data) {
  return request({
    url: "/addAdvert",
    method: "post",
    withCredentials: true,
    data
  });
}
