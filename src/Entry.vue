<template>
  <el-container>
    <el-header>
      <h1>应用市场工具</h1>
    </el-header>
    <el-main>
      <div class="category-card-list">
        <div class="category-card" v-for="category in categories" :key="category.title">
          <h2 class="category-title">{{ category.title }}</h2>
          <div class="tool-card-list">
            <div class="tool-card" v-for="tool in category.tools" :key="tool.name">
              <img :src="tool.icon" alt="Tool Icon" class="tool-icon-large" />
              <router-link :to="tool.link" class="tool-link-large">{{ tool.name }}</router-link>
            </div>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
export default {
  setup() {
    const categories = [
      {
        title: '快应用抓包',
        tools: [
          {
            name: '小米应用商店',
            icon: require('@/assets/xiaomi.png'),
            link: '/xiaomi-app-store',
          },
          {
            name: 'vivo应用商店',
            icon: require('@/assets/vivo.png'),
            link: '/vivo-app-store',
          },
          {
            name: 'oppo应用商店',
            icon: require('@/assets/oppo.png'),
            link: '/oppo-app-store',
          },
          {
            name: '华为应用商店',
            icon: require('@/assets/hw.png'),
            link: '/huawei-app-store',
          },
        ],
      },
      {
        title: '代码检测',
        tools: [
          {
            name: '关键字检测',
            icon: '',
            link: '/keyword-detection',
          },
        ],
      },
    ];

    return {
      categories,
    };
  },
};
console.log('Entry.vue');
</script>

<style>
.el-header {
  text-align: center;
  padding: 20px;
  color: black;
}
.category-title {
  margin-bottom: 20px;
  display: block;
}
.category-card-list {
  display: block; /* 使每个分类卡片单独占一行 */
  margin-top: 20px;
  width: 100%;
}

.category-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  margin: 10px auto; /* 居中对齐 */
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 80%;
}
.tool-card-list {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 20px;
}
.tool-card {
  display: block; /* 每个工具卡片单独占一行 */
  text-align: center; /* 上图下文布局 */
  margin-bottom: 20px; /* 增加间距 */
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.tool-icon-large {
  width: 130px; /* 放大图标 */
  height: 130px;
  margin-bottom: 40px; /* 图标与文字之间的间距 */
}

.tool-link-large {
  color: #409eff;
  text-decoration: none;
  font-size: 20px; /* 调大字体 */
}

.tool-link-large:hover {
  text-decoration: underline;
}
</style>