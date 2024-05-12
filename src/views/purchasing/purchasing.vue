<template>
    <div class="m-5 relative">
        <div class="flex items-center justify-between mb-5">
            <div class="flex items-center space-x-2">
                <div class="relative flex items-center">
                    <input v-model="search" type="text" class="form-control w-64" placeholder="sercah no or supplier name">
                    <button v-if="search" @click="search=''" class="absolute right-3"><i class="icon-cancel-circle2"></i></button>
                </div>
                <div class="inline-flex rounded-sm" role="group">
                    <button @click="status='RFQ'" type="button" :class="[status == 'RFQ' ? 'bg-green-500 text-green-50': 'hover:text-green-500 bg-white']" class="px-4 py-2 text-sm font-medium text-gray-900 border rounded-s">
                        RFQ
                    </button>
                    <button @click="status='RFQ SENT'" type="button" :class="[status == 'RFQ SENT' ? 'bg-green-500 text-green-50': 'hover:text-green-500 bg-white']" class="px-4 py-2 text-sm font-medium text-gray-900 border-t border-b border-r">
                        RFQ SENT
                    </button>
                    <button @click="status='DONE'" type="button" :class="[status == 'DONE' ? 'bg-green-500 text-green-50': 'hover:text-green-500 bg-white']" class="px-4 py-2 text-sm font-medium text-gray-900 border-t border-b border-r">
                        DONE
                    </button>
                </div>
            </div>
            <div class="flex items-center">
                <button @click="onDwonload" class="px-5">DOWNLOAD</button>
                <router-link to="/purchasing/new" class="bg-green-500 h-9 flex items-center rounded px-5 text-green-50 hover:bg-green-600">New RFQ</router-link>
            </div>
        </div>
        <div class="w-full rounded overflow-hidden bg-white">
            <table class="w-full">
                <thead>
                    <th class="pl-5 py-3 pr-3 bg-gray-900" style="width: 10%"></th>
                    <th class="p-3 bg-gray-900 text-gray-50">Item</th>
                    <th class="p-3 bg-gray-900 text-gray-50">Vendor</th>
                    <th class="p-3 bg-gray-900 text-gray-50">Order Date</th>
                    <th class="p-3 bg-gray-900 text-gray-50 text-right">Total</th>
                    <th class="pl-3 py-3 pr-5 bg-gray-900 text-gray-50">Status</th>
                </thead>
                <tbody class="divide-y">
                    <tr v-for="(prc, i) in purchases" :key="i" @click="onDetail(prc._id)" class=" cursor-pointer hover:bg-gray-50">
                        <td class="pl-5 py-3 pr-3">{{prc.purchaseNo}}</td>
                        <td class="p-3">{{prc.remarks}}</td>
                        <td class="p-3">{{prc.supplier}}</td>
                        <td class="p-3">{{getDate(prc.invoiceDate)}}</td>
                        <td class="p-3 text-right">{{Intl.NumberFormat().format(prc.total)}}</td>
                        <td class="p-3">
                            <div class="flex items-center justify-between">
                                <div>{{prc.status}}</div>
                                <div v-if="status == 'RFQ'">
                                    <button @click.stop="onDelete(prc)" class="bg-red-500 px-3 py-1 rounded-full text-red-50">Hapus</button>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-show="isLoading" class="h-9 mt-5 absolute w-full bottom-0 bg-gray-300  rounded text-center flex items-center justify-center">Mohon tunggu...</div>
        <button v-show="buttonTop" @click="onButtonTotop" class="h-11 w-11 bg-blue-500 rounded-full fixed bottom-5 right-5 flex items-center justify-center text-blue-50">
            <i class="icon-arrow-up8"></i>
        </button>
        <modal :show="modalDelete">
            <div class=" w-2/6 bg-white border rounded p-5">
                <div class="text-center text-xl font-bold">HAPUS PURCHASING</div>
                <div class="text-center mt-10">
                    <button @click="modalDelete = false" class="border rounded px-5 h-9 mr-2">Batal</button>
                    <button @click="deletePurchase" class="border bg-red-500 text-red-50 rounded px-5 h-9" :disabled="isDisabled">Hapus</button>
                </div>
            </div>
        </modal>
    </div>
</template>

<script>
import axios from 'axios'
import debounce from 'lodash.debounce'
import modal from '../../components/Modal.vue'
export default {
    components: {modal},
    data () {
        return {
            search: '',
            isLoading: false,
            isDisabled: false,
            buttonTop: false,
            searchData: '',
            purchases: [],
            status: 'RFQ',
            page: 1,
            content: '',
            modalDelete: false,
            deleteId: ''
        }
    },
    mounted () {
        this.searchData = debounce(() => {
            this.getData()
        }, 300)
        this.content = document.getElementById('content')
        document.getElementById('content').addEventListener('scroll', this.onScroll)
        this.getData()
    },
    destroyed() {
        document.getElementById('content').removeEventListener('scroll', this.onScroll)
    },
    methods: {
        onDwonload () {
            axios.get('/purchases/download', {
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
        onScroll () {
            const content = document.getElementById('content')
            const {scrollTop, scrollHeight, clientHeight} = content
            console.log(scrollTop, clientHeight, scrollHeight)
            if(scrollTop + clientHeight >= scrollHeight) {
                this.getData(this.page + 1)
            }
            if(scrollTop > 100) {
                this.buttonTop = true
            } else {
                this.buttonTop = false
            }
            
        },
        onButtonTotop () {
            document.getElementById('content').scrollTo({top: 0, behavior: 'smooth'})
        },
        getData (e) {
            this.isLoading = true
            axios.get('/purchases', {
                params: {
                    search: this.search,
                    status: this.status,
                    page: e
                }
            })
            .then(res => {
                this.isLoading = false
                const data = res.data.data
                for (let item of data) {
                    this.purchases.push(item)
                }
                this.page = parseInt(res.data.pages.current_page)
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
        },
        onDelete (e) {
            this.deleteId = e._id
            this.modalDelete = true
        },
        deletePurchase () {
            this.isDisabled = true
            axios.delete('/purchases/delete/'+this.deleteId)
            .then(() => {
                this.modalDelete = false
                this.deleteId = ''
                this.getData()
                this.isDisabled = false
                this.purchases = []
            })
        }
    },
    watch: {
        search () {
            this.purchases = []
            this.page = 1
            this.searchData()
        },
        status () {
            this.purchases = []
            this.page = 1
            this.getData()
        }
    }
}
</script>