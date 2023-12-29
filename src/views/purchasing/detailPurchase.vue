<template>
    <div>
        <div class="flex justify-between items-center h-9 bg-gray-600 px-5">
            <div class="flex items-center font-semibold text-gray-400">
                <div class="relative">
                    <div :class="{'text-yellow-400': form.status == 'RFQ'}">RFQ</div>
                    <div class="absolute border-gray-500 border-t border-r w-6 -right-5 h-6 rotate-45 -top-0.5"></div>
                </div>
                <div class="relative ml-10">
                    <div :class="{'text-yellow-400': form.status == 'RFQ SENT'}">RFQ SENT</div>
                    <div class="absolute border-gray-500 border-t border-r w-6 -right-5 h-6 rotate-45 -top-0.5"></div>
                </div>
                <div class="relative ml-10">
                    <div :class="{'text-yellow-400': form.status == 'DONE'}">DONE</div>
                    <div class="absolute border-gray-500 border-t border-r w-6 -right-5 h-6 rotate-45 -top-0.5"></div>
                </div>
            </div>
            <div class="text-gray-300 font-semibold">
                <button v-show="form.status == 'RFQ'" @click="onSave('RFQ SENT')" class="text-gray-300 hover:text-gray-400">SENT</button>
                <button v-show="form.status == 'RFQ SENT'" @click="onSave('DONE')" class="text-gray-300 hover:text-gray-400">DONE</button>
            </div>
        </div>
        <div class="m-5">
            <div class="grid grid-cols-2 bg-white p-5 gap-10">
                <div>
                    <div class="flex items-center space-x-3 mb-5">
                        <button><i class="icon-star-empty3 icon-2x"></i></button>
                        <div class="text-2xl">New</div>
                    </div>
                    <div>
                        <span>SUPPLIER</span>
                        <div class="flex flex-col mt-3">
                            <autocomplete v-model="supplier" :err="err.supplier" :label="supplierName" @onCreate="onCreateSupplier($event)" @input="onSelectSupplier($event)" :placeholder="'Pilih supplier'" :url="'/purchases/suppliers'">
                                <template #default="item">
                                    <div>
                                        <span>{{item.item.name}}</span>
                                    </div>
                                </template>
                            </autocomplete>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="mb-5">
                        <span>INVOICE DATE</span>
                        <div class="mt-2">
                            <date-picker v-model="form.invoiceDate" :masks="masks" class="mt-2">
                                <template v-slot="{inputValue, togglePopover}">
                                    <div class="flex">
                                        <span class="h-9 flex items-center justify-center w-10 bg-gray-100 border rounded-l-sm px-5"><i class="icon-calendar3"></i></span>
                                        <input :value="inputValue" @click="togglePopover" type="text" class="form-control rounded-tl-none rounded-bl-none border-l-0 text-blue-500">
                                    </div>
                                </template>
                            </date-picker>
                        </div>
                    </div>
                    <div>
                        <input v-model="form.remarks" type="text" class="form-control" placeholder="Remarks">
                    </div>
                </div>
            </div>
            <div class="bg-white grid grid-cols-9 px-5 pb-5 gap-3">
                <div class="col-span-1 relative flex items-center">
                    <span class="absolute left-3"><i class="icon-barcode2"></i></span>
                    <input v-model="sku" ref="sku" type="text" class="form-control pl-9 focus:border-teal-500" maxlength="5" placeholder="SKU">
                </div>
                <div class="col-span-5">
                    <input v-model="item.name" type="text" class="form-control bg-gray-50 text-gray-500" readonly>
                </div>
                <div class="col-span-2 relative flex items-center">
                    <span class="absolute left-3 text-gray-400">Rp.</span>
                    <autonumeric @keydown.enter.native="onEnterPrice" v-model="item.price" ref="price" class="form-control text-right"></autonumeric>
                </div>
                <div class="col-span-1 relative flex items-center">
                    <span class="absolute left-3 text-gray-400">QTY</span>
                    <autonumeric v-model="item.qty" @keydown.enter.native="onEnterQty" ref="qty" class="form-control text-right"></autonumeric>
                </div>
            </div>
            <table class="w-full">
                <thead>
                    <th class="pl-5 py-3 pr-3 bg-gray-900 text-gray-50" style="width: 10%">SKU</th>
                    <th class="p-3 bg-gray-900 text-gray-50" style="width: 45%">ITEM</th>
                    <th class="p-3 bg-gray-900 text-gray- text-right" style="width: 10%">PRICE</th>
                    <th class="p-3 bg-gray-900 text-gray-50 text-right" style="width: 10%">QTY</th>
                    <th class="p-3 bg-gray-900 text-gray-50 text-right" style="width: 10%">TOTAL</th>
                    <th class="p-3 bg-gray-900 text-gray-50 text-center" style="width: 5%">ACTION</th>
                </thead>
                <tbody class="divide-y bg-white">
                    <tr v-for="(item, i) in items" :key="i">
                        <td class="pl-5 py-3 pr-3">{{item.sku}}</td>
                        <td class="p-3">{{item.name}}</td>
                        <td class="p-3 text-right">{{Intl.NumberFormat().format(item.price)}}</td>
                        <td class="p-3 text-right">{{item.qty}}</td>
                        <td class="p-3 text-right">{{Intl.NumberFormat().format(item.total)}}</td>
                        <td class="p-3 text-center hover:text-red-600"><button @click="onDeleteItem(item)"><i class="icon-trash text-red-500"></i></button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
import Autocomplete from '../../components/Autocomplete.vue'
import Autonumeric from '../../components/Autonumeric.vue'
import DatePicker from 'v-calendar/src/components/DatePicker.vue'
import axios from 'axios'
export default {
    components: {Autocomplete, Autonumeric, DatePicker},
    data () {
        return {
            isDisabled: false,
            supplier: '',
            supplierName: '',
            sku: '',
            alert: false,
            item: {
                productId: '',
                sku: '',
                name: '',
                price: '',
                qty: '',
                total: ''
            },
            masks: {
                input: 'DD/MM/YYYY'
            }, 
            form: {
                supplierId: '',
                remarks: '',
                invoiceDate: '',
                items: [],
            },
            err: {
                supplier: ''
            }
        }
    },
    mounted () {
        this.getData()
        this.form.invoiceDate = new Date()
    },
    computed: {
        items () {
            let item = this.form.items.map(obj => {
                obj.total = obj.price * obj.qty
                return obj
            })
            return item.reverse()
        },
    },
    methods: {
        getData () {
            axios.get('/purchases/detail/'+this.$route.params.id)
            .then(res => {
                this.form = res.data
                this.supplierName = res.data.supplier
            })
        },
        onSave (e) {
            if(!this.form.supplierId) {
                this.err.supplier = true
            }
            if(this.form.supplierId) {
                this.isDisabled = true
                axios.put('/purchases/update/'+this.$route.params.id, {status: e})
                .then(() => {
                    this.$router.push('/purchasing')
                })
            }
        },
        getProduct () {
            axios.get('/purchases/product', {
                params: {
                    sku: this.sku
                }
            })
            .then(res => {
                if(res.data) {
                    this.item.productId = res.data._id
                    this.item.sku = res.data.sku
                    this.item.name =res.data.name
                    this.item.price = res.data.purchase
                    this.$nextTick(() => {
                        this.$refs.price.$el.focus()
                    })
                }
            })
        },
        onEnterPrice () {
            if(this.item.price > 0) {
                this.$refs.qty.$el.focus()
            }
        },
        onEnterQty () {
            if(this.item.price && this.item.qty) {
                let id = this.form.items.find(obj => obj.productId == this.item.productId)
                if(!id) {
                    this.item.total = this.item.qty * this.item.price
                    axios.put('/purchases/insert/'+this.$route.params.id, this.item)
                    .then(res => {
                        this.form.items = res.data.items
                        this.item = {
                            productId: '',
                            sku: '',
                            name: '',
                            price: '',
                            qty: '', 
                            total: '',
                        }
                    })
                    this.sku = ''
                    this.$refs.sku.focus()
                } else {
                    this.alert = true
                }
            }
        },
        onDeleteItem (i) {
            axios.put('/purchases/delete/'+this.$route.params.id, i)
            .then(res => {
                this.form.items = res.data.items
            })
            this.$refs.sku.focus()
        },
        onCreateSupplier () {

        },
        onSelectSupplier (e) {
            this.form.supplierId = e._id
            this.err.supplier = ''
        }
    },
    watch: {
        sku (val) {
            if(val.length == 5) {
                this.getProduct()
            } else {
                this.item = {
                    productId: '',
                    sku: '',
                    name: '',
                    price: '',
                    qty: '',
                    total: '' 
                }
            }
        }
    }
}
</script>

