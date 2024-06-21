<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { getBooks,saveBook,deleteBooks } from '@/service/BookService';

const search = ref({
  date:'',
  name:'',//书名
  author:'',//书号
  page:0,
  pageSize:10
})

onMounted(() => {
  searchBook();
});

const toast = useToast();
const dt = ref();
const books = ref();
const total = ref(0);
const productDialog = ref(false);
const deleteBookDialog = ref(false);
const deleteBooksDialog = ref(false);
const book = ref({});
const selectedBooks = ref();
const dates = ref();
const filters = ref({
  'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
});
const submitted = ref(false);
const statuses = ref([
  {label: 'INSTOCK', value: 'instock'},
  {label: 'LOWSTOCK', value: 'lowstock'},
  {label: 'OUTOFSTOCK', value: 'outofstock'}
]);

const formatCurrency = (value) => {
  if(value)
    return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
  return;
};
// 查找书籍
const searchBook = () => {
  getBooks(search.value)
    .then(res=>{
      books.value = {}
      books.value=res.data.records
      total.value = res.data.total
    });
}
//添加书籍按钮
const createBook = () => {
  book.value = {};
  submitted.value = false;
  productDialog.value = true;
};

//关闭dialog
const hideDialog = () => {
  productDialog.value = false;
  submitted.value = false;
};
//保存书籍
const saveBooks = () => {
  submitted.value = true;

  if (book?.value.name?.trim()) {
    saveBook(book.value).then(res=>{
      if (res.code === 1){
        console.log(res)
        productDialog.value = false;
        book.value = {};
        searchBook();
        toast.add({severity:'success',summary:'添加成功',closable:false,detail:'已成功添加书籍',life:2000})
      }
    })
  }
};

//编辑书籍
const editBook = (prod) => {
  book.value = {...prod};
  productDialog.value = true;
};

//每行删除书籍按钮
const confirmDeleteProduct = (prod) => {
  book.value = prod;
  deleteBookDialog.value = true;
};
const deleteProduct = () => {
  deleteBooks(book.value.id).then(res=>{
    books.value = books.value.filter(val => val.id !== book.value.id);
    deleteBookDialog.value = false;
    toast.add({severity:'success', summary: '删除成功', detail: '书籍已成功被删除', life: 3000});
    book.value = {};
  })
};
const exportCSV = () => {
  dt.value.exportCSV();
};
const confirmDeleteSelected = () => {
  deleteBooksDialog.value = true;
};
const deleteSelectedBooks = () => {
  const ids = selectedBooks.value.map(obj=>{
    return obj.id
  }).join(",");
  deleteBooks(ids).then(res=>{
    books.value = books.value.filter(val => !selectedBooks.value.includes(val));
    deleteBooksDialog.value = false;
    selectedBooks.value = null;
    toast.add({severity:'success', summary: '删除成功', detail: '书籍已删除', life: 3000});
  })
};

const pageChange = (event) => {
  search.value.page = event.page+1;
  search.value.pageSize = event.rows;
  searchBook();
}

</script>

<template>
  <div>
    <div class="card">
      <Toolbar class="mb-4">
        <template #start>
          <Button label="添加书籍" icon="pi pi-plus" severity="success" class="mr-2" @click="createBook" />
          <Button label="刷新" icon="pi pi-refresh" severity="contrast" class="mr-2" @click="searchBook" />
          <Button label="删除选中" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected" :disabled="!selectedBooks || !selectedBooks.length" />
        </template>

        <template #center>
          <FloatLabel>
            <Calendar date-format="yymmdd" inputId="birth_date" selection-mode="range" :showButtonBar="true" v-model="search.date"></Calendar>
            <label for="birth_date">入馆日期</label>
          </FloatLabel>

          <FloatLabel>
            <InputText inputId="bookname" v-model="search.name" />
            <label for="bookname">书名</label>
          </FloatLabel>

          <FloatLabel>
          <InputText inputId="bookauthor" v-model="search.author" />
            <label for="bookauthor">作者</label>
          </FloatLabel>

          <Button label="搜索" icon="pi pi-search" severity="success" text rounded aria-label="Search" @click="searchBook"/>
        </template>

        <template #end>
          <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="导入" chooseLabel="导入" class="mr-2 inline-block" />
          <Button label="导出" icon="pi pi-upload" severity="help" @click="exportCSV($event)"  />
        </template>
      </Toolbar>

      <DataTable ref="dt" :value="books" v-model:selection="selectedBooks" dataKey="id"
                 :filters="filters">
        <template #header>
          <div class="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 class="m-0">管理书籍</h4>
            <IconField iconPosition="left">
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText v-model="filters['global'].value" placeholder="当前页查找..." />
            </IconField>
          </div>
        </template>

        <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
        <Column field="name" header="书名" sortable style="min-width:16rem"></Column>
        <Column field="inDate" header="入馆时间" sortable style="min-width:10rem"></Column>
        <Column field="author" header="作者" sortable style="min-width:12rem"></Column>
        <Column field="count" header="馆藏数量" sortable style="min-width:12rem"></Column>
        <Column :exportable="false" style="min-width:8rem">
          <template #body="slotProps">
            <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editBook(slotProps.data)" />
            <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(slotProps.data)" />
          </template>
        </Column>
      </DataTable>
      <Paginator :rows="search.pageSize" :totalRecords="total" :rowsPerPageOptions="[10, 20, 30]" @page="event => pageChange(event)"/>
    </div>

    <Dialog v-model:visible="productDialog" :style="{width: '450px'}" header="书籍详情" :modal="true" class="p-fluid">
      <img v-if="book.image" :src="`https://primefaces.org/cdn/primevue/images/product/${book.image}`" :alt="book.image" class="block m-auto pb-3" />
      <div class="field">
        <label for="name">书名</label>
        <InputText id="name" v-model.trim="book.name" required="true" autofocus :invalid="submitted && !book.name" />
        <small class="p-error" v-if="submitted && !book.name">书名不可为空</small>
      </div>
      <div class="field">
        <label for="author">作者</label>
        <InputText id="author" v-model="book.author" required="true" :invalid="submitted && !book.author" />
        <small class="p-error" v-if="submitted && !book.author">作者不可为空</small>
      </div>
      <div class="field">
          <label for="count">馆藏数量</label>
          <InputNumber id="count" v-model="book.count" mode="decimal" currency="USD" locale="zh-cn" />
      </div>
      <template #footer>
        <Button label="取消" icon="pi pi-times" text @click="hideDialog"/>
        <Button label="保存" icon="pi pi-check" text @click="saveBooks" />
      </template>
    </Dialog>

    <Dialog v-model:visible="deleteBookDialog" :style="{width: '450px'}" header="确认删除" :modal="true">
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="book">你确定删除《 <b>{{ book.name }}</b>》吗?</span>
      </div>
      <template #footer>
        <Button label="否" icon="pi pi-times" text @click="deleteBookDialog = false"/>
        <Button label="是" icon="pi pi-check" text @click="deleteProduct" />
      </template>
    </Dialog>

    <Dialog v-model:visible="deleteBooksDialog" :style="{width: '450px'}" header="确认批量删除" :modal="true">
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="book">确认删除选中的书籍吗?</span>
      </div>
      <template #footer>
        <Button label="否" icon="pi pi-times" text @click="deleteBooksDialog = false"/>
        <Button label="是" icon="pi pi-check" text @click="deleteSelectedBooks" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped lang="scss">

</style>
