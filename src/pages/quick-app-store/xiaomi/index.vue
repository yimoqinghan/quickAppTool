<template>
  <el-container>
    <el-header>
      <el-input
        v-model="appName"
        placeholder="请输入应用名称"
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
        <h3>{{ selectedAppInfo.packageName }}</h3>
        <p>公司: {{ selectedAppInfo.company }}</p>
        <a :href="selectedAppInfo.link" target="_blank" class="download-link">下载应用</a>
      </div>
      <!-- 仅在未选择应用时显示应用列表 -->
      <div v-if="!selectedAppInfo">
        <div v-if="appList.length === 0" class="no-results">未找到匹配的应用</div>
        <div v-else class="app-card-list">
          <div
            v-for="app in paginatedAppList"
            :key="app.packageName"
            class="app-card"
            @click="getAppDetails(app.packageName)"
          >
            <img :src="app.icon" alt="App Icon" class="app-icon" />
            <div class="app-info">
              <h3>{{ app.appName }}</h3>
              <p>版本号: {{ app.appVersionCode }}</p>
              <p>包名: {{ app.packageName }}</p>
              <p>描述: {{ app.description.slice(0, 20) }}...</p>
            </div>
          </div>
        </div>
        <el-pagination
          v-if="appList.length > 0"
          background
          layout="sizes, prev, pager, next"
          :total="appList.length"
          :page-size="pageSize"
          :page-sizes="pageSizes"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
          style="margin-top: 20px; display: flex; justify-content: center;"
        />
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { ref, computed } from 'vue';
import axios from 'axios';
import qs from 'qs';

export default {
  setup() {
    const appName = ref('');
    const appList = ref([]);
    const pageSizes = ref([5, 10, 20, 50]);
    const pageSize = ref(10);
    const currentPage = ref(1);
    const selectedAppInfo = ref(null);

    const paginatedAppList = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      const end = start + pageSize.value;
      return appList.value.slice(start, end);
    });

    const searchApp = async () => {
      try {
        selectedAppInfo.value = null;
        const response = await axios.get('/api/v2/app/search/list', {
          params: {
            deviceType: 1,
            keywords: `%${appName.value}%`,
            pageSize: pageSize.value,
            pageNum: currentPage.value,
          },
        });

        if (response.data.code === 0) {
          appList.value = response.data.data;
        } else {
          appList.value = [];
          alert('未找到匹配的应用');
        }
      } catch (error) {
        console.error('Error fetching app list:', error);
      }
    };

    const getAppDetails = async (packageName) => {
      try {
        const url = qs.stringify({
          device_model: 'dipper',
          deviceIdType: 'oaid',
          is_global: false,
          check_whitelist: false,
          deviceId: '52e1dcfbf9bc8fca',
          hybrid_version_code: '11060601',
          os_version_type: 'V12.5.2.0.QEACNXM(stable)',
          android_os_version: 29,
          platform_version: 1106,
          imei_md5: '',
          guid: 'fcd28f5d-79d0-4419-995b-1c2e3aa5d099',
          region: 'CN',
          network_type: 'wifi',
          oaid: '52e1dcfbf9bc8fca',
          screen_width: 1080,
          screen_height: 2115,
          screen_density: 2.75,
          app_version_code: -1,
          server_settings_last_modify: -1,
          package_name: packageName,
          device_type: 'phone',
        });
        const response = await axios.post(`/query/api/app/query.v2?${url}`);

        let data = response.data;
        console.log('data', data);
        if (typeof data === 'string') {
          const encoder = new TextEncoder();
          data = encoder.encode(data);
        }

        const decodedData = new TextDecoder('utf-8').decode(new Uint8Array(data));
        console.log('decodedData', JSON.stringify(decodedData));
        const linkPattern = /https:\/\/cdn\.hybrid\.xiaomi\.com\/quickapp-c3\/[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)?/g;
        const companyPattern = /[\u4e00-\u9fa5a-zA-Z0-9]+有限公司/;
        
        const links = decodedData.match(linkPattern);
        const filteredLinks = links ? links.filter(link => !link.endsWith('.png') && !link.endsWith('.jpg') && !link.endsWith('.jpeg')) : [];
        const company = decodedData.match(companyPattern);
        console.log('linkPattern11', filteredLinks);
        const appInfo = {
          link: filteredLinks.length > 0 ? filteredLinks[0] : null,
          company: company ? company[0] : null,
          packageName: packageName,
          icon: appList.value.find(app => app.packageName === packageName).icon,
        };

        selectedAppInfo.value = appInfo;
        console.log('Parsed App Details:', appInfo);
      } catch (error) {
        console.error('Error fetching app details:', error);
      }
    };

    const handlePageChange = (page) => {
      currentPage.value = page;
      searchApp();
    };

    const handleSizeChange = (size) => {
      pageSize.value = size;
      currentPage.value = 1;
      searchApp();
    };

    return {
      appName,
      appList,
      searchApp,
      getAppDetails,
      paginatedAppList,
      pageSize,
      pageSizes,
      handlePageChange,
      handleSizeChange,
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
  width: 160px;
  height: 160px;
  margin-bottom: 10px;
  border-radius: 4px;
}

.app-info {
  flex: 1;
}

.app-info h3 {
  margin: 0;
  font-size: 14px;
}

.app-info p {
  margin: 5px 0;
  font-size: 12px;
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
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  max-width: 800px;
  margin: 20px auto;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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