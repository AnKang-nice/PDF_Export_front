<!-- 有个textarea 支持输入多个链接，  , 换行  分割  点击确认后  会生成一个列表 -->
<!-- 会出现一个pdf配置参数模块  config -->
<!-- 会将页面 -->

<!-- 录入一个 表单       这个表单    
   

  textaera
  配置
  title



  
  
  
  
  
  -->

<!-- 全部倒出 -->

<!-- 列表
  url
  title  // title可能拿不到
  
  status
  process  进程  // 
  

  preview  
  


  operate   删除（全部倒出后点击后删除按钮隐藏）   有值之后      下载替换删除   
  
  
  -->

<template>
	<div class="export-pdf">
		<!-- 导出PDF -->

		<el-button type="primary" @click="addUrl">新增</el-button>
		<!-- url  textaera     -->
		<!-- 确定按钮 -->

		<el-form :model="form" label-width="120px">
			<el-form-item label="页面大小">
				<!-- 下拉框 -->
				<el-select v-model="form.pageSize" placeholder="请选择页面大小">
					<el-option label="A4" value="A4" />
					<el-option label="A3" value="A3" />
					<el-option label="A2" value="A2" />
					<el-option label="A1" value="A1" />
				</el-select>
			</el-form-item>
			<el-form-item label="页面边距">
				<el-input v-model="form.padding.top" />
				<el-input v-model="form.padding.right" />
				<el-input v-model="form.padding.bottom" />
				<el-input v-model="form.padding.left" />
			</el-form-item>
			<el-form-item label="是否页眉页脚">
				<el-switch v-model="form.displayHeaderFooter" />
			</el-form-item>
			<el-form-item label="页眉" v-if="form.displayHeaderFooter">
				<el-input v-model="form.headerTemplate" />
			</el-form-item>
			<el-form-item label="页脚" v-if="form.displayHeaderFooter">
				<el-input v-model="form.footerTemplate" />
			</el-form-item>
		</el-form>

		<!-- 页面大小 -->
		<!-- 页面边距 -->
		<!-- 是否页眉页脚   是再展示 -->
		<!-- 页眉 标题内容   -->
		<!-- 页脚 默认分页   -->
		<!-- 页面方向  暂时不做 -->

		<!--  -->

		<!-- 导出按钮 -->
		<el-button type="primary" @click="handleExport">导出</el-button>

		<el-table :data="exportList" style="width: 100%">
			<el-table-column prop="url" label="URL" />
			<el-table-column prop="title" label="标题" />
			<el-table-column prop="status" label="状态" />
			<el-table-column prop="preview" label="页面预览" />
			<el-table-column prop="operate" label="操作">
				<template #default="scope">
					<el-button type="primary" @click="handlePreview(scope.row)">预览</el-button>
					<el-button type="primary" @click="handleDownload(scope.row)">下载</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- 列表 -->
		<!-- 
            url  去重
            页面预览
            状态
            blob数据  不展示   但是得存
            操作：删除  下载
         -->

		<!-- 调用 直接 遍历url  + config 遍历 -->

		<el-dialog v-model="dialogVisible" title="新增" width="50%">
			<el-input v-model="urlData.url" placeholder="请输入url" />
			<!-- 标题 -->
			<el-input v-model="urlData.title" placeholder="请输入标题" />
			<el-button type="primary" @click="handleAddUrl">确定</el-button>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { exportPdf } from '@/apiFn';
// customUrl: customUrl, filename: filename, pageSize: config.pageSize, headerTitle: config.headerTitle, displayHeaderFooter: config.displayHeaderFooter
const dialogVisible = ref(false);
const exportList = ref<any[]>([]);
const form = ref({
	pageSize: '',
	padding: {
		top: 10,
		right: 10,
		bottom: 10,
		left: 10
	},
	displayHeaderFooter: false,
	headerTemplate: '',
	footerTemplate: ''
});

const urlData = ref({
	url: '',
	title: ''
});

const handlePreview = (row: any) => {
	console.log(row);
};

const handleDownload = (row: any) => {
	console.log(row);
	try {
		// 1. 获取 PDF 二进制数据（若已拿到 Buffer，直接用即可）
		const pdfBuffer = new Uint8Array(row.pdfBlob);
		// 2. 创建 PDF Blob（若为 Node.js Buffer，需先转 Uint8Array：new Uint8Array(pdfBuffer)）
		const pdfBlob = new Blob([pdfBuffer], { type: 'application/pdf' });

		// 3. 生成下载链接并触发下载
		const downloadUrl = URL.createObjectURL(pdfBlob);
		const aTag = document.createElement('a');
		aTag.href = downloadUrl;
		aTag.download = '我的PDF文件.pdf';
		document.body.appendChild(aTag);
		aTag.click();

		// 4. 清理资源
		document.body.removeChild(aTag);
		URL.revokeObjectURL(downloadUrl);
	} catch (error) {
		console.error('PDF 下载失败：', error);
	}
};

const addUrl = () => {
	// 打开弹窗
	dialogVisible.value = true;
};

const handleAddUrl = () => {
	console.log(urlData.value);
	dialogVisible.value = false;
	exportList.value.push(urlData.value);
	urlData.value = {
		url: '',
		title: ''
	};
};

const handleExport = () => {
	console.log(exportList.value);

	for (const item of exportList.value) {
		exportPdf(
			{
				customUrl: item.url,
				filename: item.title,
				pageSize: form.value.pageSize,
				headerTitle: form.value.headerTemplate,
				displayHeaderFooter: form.value.displayHeaderFooter
			},
			{
				responseType: 'arraybuffer' // 添加这个配置来正确接收二进制数据
			}
		).then((res) => {
			console.log(res, 99);
			item.pdfBlob = res.data.pdfData.data;
		});
	}
};
</script>

<style scoped></style>
