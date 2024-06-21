import request from "@/utils/request";


function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}/${month}/${day}`;
}

export function getBooks(search){
  const data = {
    from:'',
    to:'',
    name:search.name,//书名
    author:search.author,//书号
    page:search.page,
    pageSize:search.pageSize
  }
  if (search.date !== null && search.date !== ''){
    data.from = formatDate(search.date[0]);
    data.to = formatDate(search.date[1]);
  }

  return  request({
    url:'/book/search',
    headers:{
      isToken:true
    },
    method:"POST",
    data:data
  });
}

export function saveBook(book){
  let url = '/book/save';
  if (book.id !== null || book.id !== ''){
    url = '/book/update';
  }
  return request({
    url:url,
    headers:{
      isToken:true
    },
    method:"POST",
    data:book
  });
}

export function deleteBooks(books){
  return request({
    url:'/book/delete?ids='+books,
    headers:{
      isToken:true
    },
    method:"POST",
  });
}
