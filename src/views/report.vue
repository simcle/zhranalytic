<template>
    <div class="m-5 bg-white rounded">
        <div class="p-3 text-right">{{rupiah(totalLost)}}</div>
        <table class="w-full">
            <thead>
                <th class="p-3 bg-gray-900 text-gray-50">SKU</th>
                <th class="p-3 bg-gray-900 text-gray-50">Name</th>
                <th class="p-3 bg-gray-900 text-gray-50 text-right">Permintaan</th>
                <th class="p-3 bg-gray-900 text-gray-50 text-right">Terpenuhi</th>
                <th class="p-3 bg-gray-900 text-gray-50 text-right">Penjualan</th>
                <th class="p-3 bg-gray-900 text-gray-50 text-right">Stok</th>
                <th class="p-3 bg-gray-900 text-gray-50 text-right">Lost</th>
            </thead>
            <tbody class="divide-y">
                <tr v-for="(item, i) in itemsLists" :key="i">
                    <td class="p-3">{{item.sku}}</td>
                    <td class="p-3">{{item.name}}</td>
                    <td class="p-3 text-right">{{item.permintaan}}</td>
                    <td class="p-3 text-right">{{item.pemenuhan}}</td>
                    <td class="p-3 text-right">{{item.penjualan}}</td>
                    <td class="p-3 text-right">{{item.stock}}</td>
                    <td class="p-3 text-right">{{rupiah(item.lost)}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    data () {
        return {
            items: []
        }
    },
    computed: {
        itemsLists () {
            return this.items.map(obj => {
                obj.lost = (obj.permintaan - obj.pemenuhan) * obj.harga
                return obj
            })
        },
        totalLost () {
            let sum = 0;
            for(let i = 0; i < this.items.length; i++) {
                if(this.items[i].lost) {
                    sum +=  parseInt(this.items[i].harga)
                }
            }
            return sum
        }
    },
    mounted () {
        this.getData()
    },
    methods: {
        getData () {
            axios.get('/analytics/report')
            .then(res => {
                this.items = res.data
            })
        },
        rupiah (number) {
            return Intl.NumberFormat().format(number)
        }
    }
}
</script>