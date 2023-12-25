<template>
    <div class="p-5">
        <div class="flex items=center justify-between mb-5">
            <div>
                <input v-model="search" type="text" class="form-control w-64" placeholder="Serach SKU">
            </div>
            <div class="flex items-center space-x-3">
                <div class="inline-flex rounded-sm" role="group">
                    <button @click="time='1D'" type="button" :class="[time == '1D' ? 'bg-green-500 text-green-50': 'hover:text-green-500 bg-white']" class="px-4 py-2 text-sm font-medium text-gray-900 border rounded-s">
                        1D
                    </button>
                    <button @click="time='7D'" type="button" :class="[time == '7D' ? 'bg-green-500 text-green-50': 'hover:text-green-500 bg-white']" class="px-4 py-2 text-sm font-medium text-gray-900 border-t border-b border-r">
                        7D
                    </button>
                    <button @click="time='30D'" type="button" :class="[time == '30D' ? 'bg-green-500 text-green-50': 'hover:text-green-500 bg-white']" class="px-4 py-2 text-sm font-medium text-gray-900 border-t border-b border-r">
                        30D
                    </button>
                    <button @click="time='90D'" type="button" :class="[time == '90D' ? 'bg-green-500 text-green-50': 'hover:text-green-500 bg-white']" class="px-4 py-2 text-sm font-medium text-gray-900 border-t border-b">
                        90D
                    </button>
                    <button @click="time='1Y'" type="button" :class="[time == '1Y' ? 'bg-green-500 text-green-50': 'hover:text-green-500 bg-white']" class="px-4 py-2 text-sm font-medium text-gray-900 border border-gray-200 rounded-e">
                        1Y
                    </button>
                </div>
                <div>
                    <button @click="downloadData" class="h-9 rounded px-5 bg-green-500 text-green-50">DWONLOAD xlsx</button>
                </div>
            </div>
        </div>
        <div class="bg-white flex-grow overflow-auto top-0 rounded">
            <table class="w-full relative">
                <thead>
                    <th class="pl-5 py-3 pr-3 bg-gray-700 text-gray-50 sticky top-0" style="width:10%">SKU</th>
                    <th class="p-3 bg-gray-700 text-gray-50 sticky top-0" style="width: 50%">ITEM NAME</th>
                    <th class="p-3 hover:text-green-500 cursor-pointer bg-gray-700 text-gray-50 sticky top-0">
                        <div class="flex items-center justify-end">
                            SOLD
                        </div>
                    </th>
                    <th class="pl-3 py-3 pr-5 hover:text-green-500 cursor-pointer bg-gray-700 text-gray-50 sticky top-0">
                        <div class="flex items-center justify-end">
                            STOCK
                        </div>
                    </th>
                </thead>
                <tbody class="divide-y">
                    <tr v-for="(item, i) in items" :key="i" class="hover:bg-gray-100 cursor-pointer" @click="onDetail(item)">
                        <td class="pl-5 pr-3 py-3">{{item.sku}}</td>
                        <td class="p-3">{{item.name}}</td>
                        <td class="p-3 text-right">{{item.sold}}</td>
                        <td class="pl-3 pr-5 py-3 text-right">{{item.stock}}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <modal :show="modalDetail">
            <div class="w-3/4 bg-white rounded overflow-hidden">
                <div class="p-5 border flex justify-between">
                    <div>SKU: {{detail.sku}} {{detail.name}}</div>
                    <button @click="modalDetail = false" class="hover:text-red-500"><i class="icon-cancel-circle2"></i></button>
                </div>
                <div class="grid grid-cols-7 gap-3">
                    <div v-for="(shop, i) in detail.shops" :key="i" class="text-right border-b-4 border-gray-400 p-3">
                        <div class="flex items-center justify-between">
                            <div><i class="icon-store text-gray-400"></i></div>
                            <div>
                                <div class="text-xs text-green-500">Sold: {{shop.sold}}</div>
                                <div class="text-xs text-red-500">Stock: {{shop.stock}}</div>
                            </div>
                        </div>
                        <div class="font-semibold">{{shop.name}}</div>
                    </div>
                </div>
                <div class="mt-5">
                    <canvas id="myChart" height="70px"></canvas>
                </div>
            </div>
        </modal>

    </div>
</template>

<script>
import axios from 'axios'
import Modal from '../components/Modal.vue'
import ChartJs from 'chart.js/auto'
export default {
    components: {Modal},
    data () {
        return {
            search: '',
            items: [],
            time: '7D',
            modalDetail: false,
            detail: {
                name: '',
                sku: '',
                shops: []
            },
            labels: [],
            stats: []
        }
    },
    mounted () {
        let app = this
        const chartSales = document.getElementById('myChart')
        window.mychart = new ChartJs(chartSales, {
            type: 'line',
            data: {
                labels: app.labels,
                datasets: [
                    {
                        data: app.stats
                    }
                ]
            },
            options: {
                plugins: {
                    legend: {
						display: false,
					},
                }
            }
        })
    },
    methods: {
        getData () {
            axios.get('/analytics/products/sku', {
                params: {
                    search: this.search,
                    time: this.time
                }
            })
            .then(res => {
                this.items = res.data
            })
        },
        downloadData () {
            axios.get('/analytics/products/download/sku', {
                params: {
                    search: this.search,
                    time: this.time
                },
                responseType: 'blob'
            })
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
				const link = document.createElement('a');
				link.href = url;
				link.setAttribute('download', 'statistics.xlsx'); //or any other extension
				document.body.appendChild(link);
				link.click();
            })
        },
        onDetail (e) {
            const ln = this.labels.length
            this.labels.splice(0, ln)
            this.stats.splice(0, ln)
            this.modalDetail = true
            this.detail = {
                name: e.name,
                sku: e.sku,
                shops: []
            }
            axios.get('/analytics/products/detail', {
                params: {
                    productId: e._id,
                    time: this.time
                }
            })
            .then(res => {
                this.detail.shops = res.data.shops
                const sls = res.data.stats
                for(let i = 0; i < sls.length; i++) {
                    this.labels.push(sls[i]._id)
                    this.stats.push(sls[i].qty)
                }
                this.$nextTick(() => {
                    window.mychart.update()
                })
            })
        },
    },
    watch: {
        search (val) {
            if(val.length == 5) {
                this.getData()
            }
            if(val.length == 0) {
                this.getData()
            }
        },
        time () {
            this.getData()
        }
    }
}
</script>