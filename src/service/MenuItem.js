import request from "@/utils/request";

export function getMenu(){
  return request({
    url:'/menu/list',
    headers:{
      isToken:true
    },
    method:"GET",
  });
}
