import { createRouter, RouteRecordRaw, createWebHashHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
      path: '/',
      name: 'Home',
      component: () => import(/* webpackChunkName: "about" */ '@/components/home/Home.vue')
    } ,
    {
        path: '/stand',
        name: 'Stand',
        component: () => import(/* webpackChunkName: "about" */ '@/components/stand/Stand.vue')
    }
];
const router = createRouter({
    history: createWebHashHistory(),
    routes,
});


export default router;
