import axiosInstance from '@/api';

export const exportPdf = (data: any, config: any) => {
	return axiosInstance.post('/api/generate-pdf', data, {
		...config
	});
};

//
