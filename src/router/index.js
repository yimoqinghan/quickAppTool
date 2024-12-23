import { createRouter, createWebHistory } from 'vue-router';
import Entry from '../Entry.vue';
import XiaomiAppStore from '../pages/quick-app-store/xiaomi/index.vue';
import VivoAppStore from '../pages/quick-app-store/vivo/index.vue';
//import HuaweiAppStore from '../pages/quick-app-store/huawei/index.vue';
import OppoAppStore from '../pages/quick-app-store/oppo/index.vue';
//import HonorAppStore from '../pages/quick-app-store/honor/index.vue';
import KeywordDetection from '../pages/keyword-detection/index.vue';

const routes = [
  {
    path: '/',
    name: 'Entry',
    component: Entry,
  },
  {
    path: '/xiaomi-app-store',
    name: 'XiaomiAppStore',
    component: XiaomiAppStore,
  },
  // 其他应用商店和工具的路由
  {
   path: '/vivo-app-store',
   name: 'VivoAppStore',
   component: VivoAppStore,
  },
  //{
  //  path: '/huawei-app-store',
  //  name: 'HuaweiAppStore',
  //  component: HuaweiAppStore,
  //},
  {
   path: '/oppo-app-store',
   name: 'OppoAppStore',
   component: OppoAppStore,
  },
  //{
  //  path: '/honor-app-store',
  //  name: 'HonorAppStore',
  //  component: HonorAppStore,
  //},
  {
    path: '/keyword-detection',
    name: 'KeywordDetection',
    component: KeywordDetection, // 假设关键字检测也使用相同的组件
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
