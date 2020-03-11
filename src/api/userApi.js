import request from "./request";
export function getUserInfo() {
  return request({ url: "/getUserInfo", method: "get", withCredentials: true });
}
export function addAccount(data) {
  return request({
    url: "/addAccount",
    method: "post",
    withCredentials: true,
    data
  });
}
export function updateAccount(data) {
  return request({
    url: "/updateAccount",
    method: "post",
    withCredentials: true,
    data
  });
}
export function deleteAccount(id) {
  return request({
    url: "/deleteAccount/" + id,
    method: "delete",
    withCredentials: true
  });
}
export function updateUser(data) {
  return request({
    url: "/updateUser",
    method: "post",
    data,
    withCredentials: true
  });
}
