<template>
    <div class="p-5 flex flex-col">
        <div class="flex items-center mb-5 justify-between">
            <div class=" flex items-center space-x-3">
                <div class="w-64 relative flex items-center">
                    <button v-show="filterCategories" @click="filterCategories = ''" class="absolute right-8 z-10"><i class="icon-cancel-circle2 pb-px"></i></button>
                    <select-2 v-model="filterCategories" :options="categories" class="form-control" :placeholder="'Filter by Category'">

                    </select-2>
                </div>
            </div>
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
        </div>
        <div class="bg-white flex-grow overflow-auto top-0 rounded">
            <table class="w-full relative">
                <thead>
                    <th class="pl-5 py-3 pr-3 bg-gray-700 text-gray-50 sticky top-0" style="width:10%">SKU</th>
                    <th class="p-3 bg-gray-700 text-gray-50 sticky top-0" style="width: 50%">ITEM NAME</th>
                    <th @click="sortBy('sold')" :class="{'text-green-500':sortKey == 'sold'}" class="p-3 hover:text-green-500 cursor-pointer bg-gray-700 text-gray-50 sticky top-0">
                        <div class="flex items-center justify-end">
                            SOLD
                            <i v-if="sortKey == 'sold'" :class="[sortOrder === 1 ? 'icon-arrow-up12':'icon-arrow-down12']"></i>
                            <i v-else class="icon-menu-open"></i>
                        </div>
                    </th>
                    <th @click="sortBy('stock')" :class="{'text-green-500':sortKey == 'stock'}" class="pl-3 pr-5 py-3 hover:text-green-500 cursor-pointer bg-gray-700 text-gray-50 sticky top-0">
                        <div class="flex items-center justify-end">
                            STOCK
                            <i v-if="sortKey == 'stock'" :class="[sortOrder === 1 ? 'icon-arrow-up12':'icon-arrow-down12']"></i>
                            <i v-else class="icon-menu-open"></i>
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
import debounce from 'lodash.debounce'
import Modal from '../../components/Modal.vue'
import ChartJs from 'chart.js/auto'
import select2 from '../../components/Select2.vue'
export default {
    components: {Modal, select2},
    data () {
        return {
            search: '',
            searchData: '',
            showFilterCategory: false,
            categories: [],
            labelCategories: [],
            filterCategories: '',
            sortKey: 'sold',
            sortOrder: '-1',
            time: '7D',
            items: [],
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
        this.searchData = debounce(() => {
            this.getData()
        }, 300)
        this.getCategories()
        this.getData()
    },
    methods: {
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
        getData () {
            axios.get('/analytics/products', {
                params: {
                    search: this.search,
                    filterCategories: this.filterCategories,
                    sortKey: this.sortKey,
                    sortOrder: this.sortOrder,
                    time: this.time
                }
            })
            .then(res => {
                this.items = res.data
            })
        },
        getCategories () {
            axios.get('/analytics/categories')
            .then(res => {
                this.categories = res.data
            })
        },
        sortBy (key) {
            if(key == this.sortKey) {
                this.sortOrder = (this.sortOrder == -1) ? 1: -1
            } else {
                this.sortKey = key
                this.sortOrder = -1
            }
            this.$nextTick(() => {
                if(this.sortKey == 'sold' || this.sortKey == 'incoming' || this.sortKey == 'stock') {
                    this.getData()
                }
            })
        },
    },
    watch: {
        filterCategories () {
            this.getData()
        },
        time () {
            this.getData()
        },
        search (val) {
            console.log(val)
            if(val.length == 5) {
                this.getData()
            } 
            if(val.length == 0) {
                this.getData()
            }
        }
    }
}
</script>