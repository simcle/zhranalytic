<template>
    <div class="m-5">
        <div class="flex justify-between items-center mb-5">
            <div class="flex items-center space-x-3">
                <div>
                    <input v-model="search" type="text" class="form-control" maxlength="5" placeholder="Search SKU">
                </div>
                <div class=" w-64">
                    <select-2 v-model="shopId" @input="onSelectShop($event)" :options="shops" class="form-control" :placeholder="'Select Outlet'"></select-2>
                </div>
            </div>
            <div>
                <button class="bg-green-500 h-9 rounded-sm text-green-50 px-5" @click="onPrint">PRINT</button>
            </div>
        </div>
        <div class="bg-white rounded overflow-auto">
            <table class="w-full">
                <thead>
                    <th class="bg-gray-900 text-gray-50 pl-5 py-3 pr-3" style="width: 10%">SKU</th>
                    <th class="bg-gray-900 text-gray-50 p-3" style="width: 50%">ITEM NAME</th>
                    <th class="bg-gray-900 text-gray-50 p-3 text-right">SOLD</th>
                    <th class="bg-gray-900 text-gray-50 pl-3 py-3 pr-5 text-right">STOCK</th>
                </thead>
                <tbody v-if="isLoading" class="divide-y">
                    <tr v-for="i in 20" :key="i">
                        <td class="pl-5 py-3 pr-3">---</td>
                        <td class="p-3">------</td>
                        <td class="p-3 text-right">---</td>
                        <td class="pl-3 py-3 pr-5 text-right">---</td>
                    </tr>
                </tbody>
                <tbody v-else class="divide-y">
                    <tr v-for="(item, i) in items" :key="i">
                        <td class="pl-5 py-3 pr-3">{{item.sku}}</td>
                        <td class="p-3">{{item.name}}</td>
                        <td class="p-3 text-right">{{item.sold}}</td>
                        <td class="pl-3 py-3 pr-5 text-right">{{item.inventory}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="hidden">
            <div id="print" class="w-full" style="width: 100%">
                <div class="font-semibold text-center mb-2">STOCK OPNAME</div>
                <table class="w-full mb-5">
                    <tbody>
                        <tr>
                            <td>
                                <div>Date</div>
                                <div>{{getDate()}}</div>
                            </td>
                            <td>
                                <div class="opacity-0">Date</div>
                                <div class="opacity-0">20 Desember 2024</div>
                            </td>
                            <td>
                                <div>Outlet</div>
                                <div class="uppercase">{{shopName}}</div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="bg-white w-full rounded overflow-auto border">
                    <table class="w-full">
                        <thead>
                            <th class="bg-gray-900 text-gray-50 pl-5 py-3 pr-3" style="width: 10%">SKU</th>
                            <th class="bg-gray-900 text-gray-50 p-3" style="width: 65%">ITEM NAME</th>
                            <th class="bg-gray-900 text-gray-50 p-3 text-right" style="width: 10%">SOLD</th>
                            <th class="bg-gray-900 text-gray-50 p-3 text-right" style="width: 10%">STOCK</th>
                            <th class="bg-gray-900 text-gray-50 p-3 text-center" style="width:5%">CHECK</th>
                        </thead>
                        <tbody class="divide-y">
                            <tr v-for="(item, i) in items" :key="i">
                                <td class="pl-5 py-3 pr-3">{{item.sku}}</td>
                                <td class="p-3">{{item.name}}</td>
                                <td class="p-3 text-right">{{item.sold}}</td>
                                <td class="p-3 text-right">{{item.inventory}}</td>
                                <td class="p-3 text-center">
                                    <div class="h-full w-full flex items-center justify-center">
                                        <div class="h-4 w-4 border border-black rounded"></div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import Select2 from '../components/Select2.vue'
import PrintJS from 'print-js'
export default {
    components: {Select2},
    data () {
        return {
            isLoading: false,
            shops: [],
            search: '',
            shopId: '',
            shopName: '',
            items: []
        }
    },
    mounted () {
        this.getShops()
    },
    methods: {
        getShops () {
            axios.get('/analytics/shops')
            .then(res => {
                this.shops = res.data
            })
        },
        getData () {
            this.isLoading = true
            axios.get('/analytics/products/task-so', {
                params: {
                    sku: this.search,
                    shopId: this.shopId
                }
            })
            .then(res => {
                this.isLoading = false
                this.items = res.data
            })
        },
        onSelectShop (e) {
            const shop = this.shops.find(obj => obj.id == e)
            this.shopName = shop.name
        },
        getDate () {
            const date = new Date()
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des']
            let Y = date.getFullYear()
            let m = months[date.getMonth()]
            let d = date.getDate()
            return `${d} ${m} ${Y}`
        },
        onPrint () {
            PrintJS({
                printable: 'print', 
                type: 'html',
                targetStyles: ['*'],
                font_size: 11,
                onPrintDialogClose: () => {
                    console.log('hallo')
                }
            })
        },
    },
    watch: {
        shopId () {
            if(this.search) {
                this.getData()
            }
        },
        search () {
            if(this.shopId) {
                this.getData()
            }
        }
    }
}
</script>
