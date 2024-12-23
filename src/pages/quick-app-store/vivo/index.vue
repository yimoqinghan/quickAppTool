<template>
  <el-container>
    <el-header>
      <el-input
        v-model="appName"
        placeholder="请输入应用包名"
        @keyup.enter="searchApp"
        clearable
        style="margin-right: 10px;max-width: 800px;" 
      />
      <el-button type="primary" @click="searchApp">搜索</el-button>
    </el-header>
    <el-main>
      <!-- 仅在选择应用时显示应用详细信息 -->
      <div v-if="selectedAppInfo" class="app-details-card">
        <img :src="selectedAppInfo.icon" alt="App Icon" class="app-icon-large" />
        <h3>{{ selectedAppInfo.rpkName }}</h3>
        <p v-if="selectedAppInfo.rpkPackage">应用包名: {{ selectedAppInfo.rpkPackage }}</p>
        <p v-if="selectedAppInfo.versionName">版本号: {{ selectedAppInfo.versionName }}</p>
        <p v-if="selectedAppInfo.description">描述内容: {{ selectedAppInfo.description }}</p>
        <p v-if="selectedAppInfo.companyName">公司: {{ selectedAppInfo.companyName }}</p>
        <p v-if="selectedAppInfo.updateDesc">更新内容: {{ selectedAppInfo.updateDesc }}</p>
        <p v-if="selectedAppInfo.updateDate">更新时间: {{ selectedAppInfo.updateDate }}</p>
        <a :href="selectedAppInfo.rpkUrl" target="_blank" class="download-link">下载应用</a>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { ref } from 'vue';
import { ElMessage } from 'element-plus'
import axios from 'axios';
import CryptoJS from 'crypto-js'; // 引入 CryptoJS

export default {
  setup() {
    const appName = ref('');
    const selectedAppInfo = ref(null);

    const searchApp = async () => {
      const rpkPackageName = appName.value || '';
      const params = {
        rpkPackage: rpkPackageName,
        timestamp: Date.now()
      };

      const keyS = new URLSearchParams(params).toString(); // 使用 URLSearchParams 简化参数拼接
      const crySign = CryptoJS.HmacSHA256(keyS, "f3fc96e7021311eaa2b30235d2b38928dfgbea").toString(); // 转换为字符串
      const allSign = { ...params, sign: crySign };
      getAppDetails(allSign)
    };

    

    const getAppDetails = async (params) => {
      try {
        console.log('params', params)
        const requestApi = await axios.post(`/vivoApi/api/p/titlebar/queryRpkInfo`, params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        console.log('requestApi', requestApi)
        if(requestApi.data.code === 0){
          selectedAppInfo.value = requestApi.data.data;
          console.log('Parsed App Details:', requestApi.data.data);
          return
        }
        console.log('requestApi', requestApi)
        ElMessage.error('获取应用信息失败')
      } catch (error) {
        console.error('Error fetching app details:', error);
        ElMessage.error('获取应用信息失败')
      }
    };


    return {
      appName,
      searchApp,
      getAppDetails,
      selectedAppInfo,
    };
  },
};
</script>

<style>
.el-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  max-width: 800px;
  margin: 0 auto;
}

.app-card-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 800px;
  margin: 0 auto;
}

.app-card {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
  transition: box-shadow 0.3s;
}

.app-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.app-icon {
  width: 80px;
  height: 80px;
  margin-right: 10px;
  border-radius: 4px;
}

.app-icon-large {
  width: 120px;
  height: 120px;
  margin-bottom: 15px;
  border-radius: 8px;
}

.app-info {
  flex: 1;
}

.app-info h3 {
  margin: 0;
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.app-info p {
  margin: 5px 0;
  font-size: 14px;
  color: #666;
}

.no-results {
  text-align: center;
  font-size: 16px;
  color: #888;
  margin-top: 20px;
}

.app-details-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  max-width: 800px;
  margin: 20px auto;
  background-color: #ffffff;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.app-details-card:hover {
  transform: translateY(-5px);
}

.download-link {
  display: inline-block;
  margin-top: 10px;
  color: #409eff;
  text-decoration: none;
  font-size: 16px;
}

.download-link:hover {
  text-decoration: underline;
}

.app-details {
  margin-top: 20px;
  text-align: center;
}

.app-details h3 {
  font-size: 18px;
  margin-bottom: 10px;
}

.app-details a {
  display: inline-block;
  margin-top: 10px;
  color: #409eff;
  text-decoration: none;
}

.app-details a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .app-card-list {
    flex-direction: column;
  }
}

body {
  background-color: #f0f0f0;
}
</style>