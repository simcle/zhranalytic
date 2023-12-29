<template>
    <div class="m-5">
        <div class="flex items-center justify-between mb-5">
            <div>
                <input type="text" class="form-control w-64">
            </div>
            <div>
                <router-link to="/purchasing/new" class="bg-green-500 h-9 block flex items-center rounded px-5 text-green-50 hover:bg-green-600">New RFQ</router-link>
            </div>
        </div>
        <div class="w-full rounded overflow-hidden bg-white">
            <table class="w-full">
                <thead>
                    <th class="pl-5 py-3 pr-3 bg-gray-900"></th>
                    <th class="p-3 bg-gray-900 text-gray-50">Vendor</th>
                    <th class="p-3 bg-gray-900 text-gray-50">Order Date</th>
                    <th class="p-3 bg-gray-900 text-gray-50 text-right">Total</th>
                    <th class="pl-3 py-3 pr-5 bg-gray-900 text-gray-50">Status</th>
                </thead>
                <tbody class="divide-y">
                    <tr v-for="(prc, i) in purchases" :key="i" @click="onDetail(prc._id)" class=" cursor-pointer hover:bg-gray-50">
                        <td class="pl-5 py-3 pr-3">{{prc.purchaseNo}}</td>
                        <td class="p-3">{{prc.supplier}}</td>
                        <td class="p-3">{{getDate(prc.invoiceDate)}}</td>
                        <td class="p-3 text-right">{{Intl.NumberFormat().format(prc.total)}}</td>
                        <td class="p-3">{{prc.status}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    data () {
        return {
            search: '',
            purchases: []
        }
    },
    mounted () {
        this.getData()
    },
    methods: {
        getData () {
            axios.get('/purchases', {
                params: {
                    search: this.search
                }
            })
            .then(res => {
                this.purchases = res.data.data
            })
        },
        getDate (e) {
            const date = new Date(e)
            let d = date.getDate()
            let m = date.getMonth() + 1
            let y = date.getFullYear()
            return `${d}/${m}/${y}`
        },
        onDetail (e) {
            this.$router.push('/purchasing/detail/'+e)
        }
    }
}
</script>