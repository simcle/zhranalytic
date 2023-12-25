<template>
    <div class="m-5">
        <div class="flex items-center justify-between mb-5">
            <div>PRODUCTS CONSUMPTIVE</div>
            <div class="text-right">{{Intl.NumberFormat().format(total)}}</div>
        </div>
        <div class="bg-white overflow-hidden rounded">
            <table class="w-full">
                <thead>
                    <th class="bg-gray-900 text-gray-50 pl-5 py-3 pr-3">SKU</th>
                    <th class="bg-gray-900 text-gray-50 p-3">ITEM NAME</th>
                    <th class="bg-gray-900 text-gray-50 p-3 text-right">STOK</th>
                    <th class="bg-gray-900 text-gray-50 p-3 text-right">PURCHASE</th>
                    <th class="bg-gray-900 text-gray-50 pl-3 py-3 pr-5 text-right">TOTAL</th>
                </thead>
                <tbody class="divide-y">
                    <tr v-for="(item, i) in items" :key="i">
                        <td class="pl-5 py-3 pr-3">{{item.sku}}</td>
                        <td class="pl-5 py-3 pr-3">{{item.name}}</td>
                        <td class="pl-5 py-3 pr-3 text-right">{{item.stock}}</td>
                        <td class="pl-5 py-3 pr-3 text-right">{{Intl.NumberFormat().format(item.price)}}</td>
                        <td class="pl-5 py-3 pr-3 text-right">{{Intl.NumberFormat().format(item.total)}}</td>
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
            items: []
        }
    },
    mounted () {
        this.getData();
    },
    computed: {
        total () {
            let sum = 0;
            for(let i = 0; i < this.items.length; i++) {
                sum += this.items[i].total
            }
            return sum
        }
    },
    methods: {
        getData () {
            axios.get('/analytics/products/consumptive')
            .then(res => {
                this.items = res.data
            })
        }
    }
}
</script>