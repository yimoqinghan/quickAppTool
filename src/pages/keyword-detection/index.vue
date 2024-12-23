<template>
  <el-container>
    <el-header>
      <el-input type="file" @change="handleFileUpload" />
      <el-button type="primary" @click="checkFiles">检查代码</el-button>
    </el-header>
    <el-main>
      <el-table :data="results" style="width: 100%">
        <el-table-column prop="file" label="文件名" />
        <el-table-column prop="code" label="代码块" />
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
import JSZip from 'jszip'; 
import { ref } from 'vue';
import config from '../../config-av.js'; // 引入 config-av.js

export default {
  setup() {
    const results = ref([]);
    const keysToCheck = Object.keys(config.pro).map(key => key.replace(/__/g, '')); // 获取所有关键字
    console.log(keysToCheck);
    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const zip = new JSZip();
          zip.loadAsync(e.target.result).then((contents) => {
            // 确保 contents.files 存在
            if (contents && contents.files) {
              Object.keys(contents.files).forEach((filename) => {
                if (!contents.files[filename].dir) {
                  contents.files[filename].async('string').then((fileData) => {
                    checkForKeys(filename, fileData);
                  });
                }
              });
            }
          }).catch((error) => {
            console.error('Error loading zip file:', error);
          });
        };
        reader.readAsArrayBuffer(file);
      }
    };

    const checkForKeys = (filename, fileData) => {
      keysToCheck.forEach((key) => {
        if (fileData.includes(key)) {
          results.value.push({ file: filename, code: fileData });
        }
      });
    };

    const checkFiles = () => {
      // 触发文件检查
      results.value = []; // 清空之前的结果
    };

    return {
      results,
      handleFileUpload,
      checkFiles,
    };
  },
};
</script>

<style>
/* 添加样式 */
</style>