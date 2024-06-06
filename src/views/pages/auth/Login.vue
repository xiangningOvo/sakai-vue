<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, computed, watch } from "vue";
import { useUserStore } from "@/store/user";
import router from "@/router";

const { layoutConfig } = useLayout();
const loginForm = ref({
  username:null,
  password:null
})
const checked = ref(false);
const usernameValid = ref(false);
const usernameErrorMessage = ref('')
const passwordValid = ref(false);

const welcome = import.meta.env.VITE_WELCOME_STR;

const logoUrl = computed(() => {
    return `/layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});

const user = useUserStore();

const submit = () => {
  const that = this;
  if (loginForm.value.username && loginForm.value.password) {
    user.setUsername( loginForm.value.username);
    user.setPassword(loginForm.value.password);
    user.Login().then((res)=>{
      router.push('/')
    }).catch(error=>{
      usernameErrorMessage.value = error.message;
      usernameValid.value = true;
      return false;
    })
  } else {
    usernameErrorMessage.value = '用户名格式不正确';
    usernameValid.value = true;
    return false
  }
}

</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" />
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
<!--                        <img src="/demo/images/login/avatar.png" alt="Image" height="50" class="mb-3" />-->
                        <div class="text-900 text-3xl font-medium mb-3">{{welcome}}</div>
                        <span class="text-600 font-medium">登录以继续使用系统</span>
                    </div>

                    <div>
                        <label for="email1" class="block text-900 text-xl font-medium mb-2">账号</label>
                      <InlineMessage v-if="usernameValid" class="block mb-2">{{ usernameErrorMessage }}</InlineMessage>
                      <InputText id="username" type="text" placeholder="账号" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="loginForm.username" v-bind:invalid="usernameValid"/>

                        <label for="password" class="block text-900 font-medium text-xl mb-2">密码</label>
                        <Password id="password" v-model="loginForm.password" placeholder="密码" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }" v-bind:invalid="passwordValid"></Password>

                        <div class="flex align-items-center justify-content-between mb-5 gap-5">
                            <div class="flex align-items-center">
                                <Checkbox v-model="checked" id="rememberme" binary class="mr-2"></Checkbox>
                                <label for="rememberme">7天免登录</label>
                            </div>
                            <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">忘记密码?</a>
                        </div>
                        <Button label="登录" class="w-full p-3 text-xl" @click="submit"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
<!--    <AppConfig simple />-->
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
