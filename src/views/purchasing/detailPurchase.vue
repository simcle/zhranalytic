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
                <button @click="onPrint" class="px-5 hover:text-gray-400">Print</button>
                <button v-show="form.status == 'RFQ'" @click="onSave('RFQ SENT')" class="text-gray-300 hover:text-gray-400">SENT</button>
                <button v-show="form.status == 'RFQ SENT'" @click="onSave('DONE')" class="text-gray-300 hover:text-gray-400">DONE</button>
                <button @click="onUpdate" class="text-green-50 hover:bg-green-600 ml-3 bg-green-500 rounded px-3">Update</button>
            </div>
        </div>
        <div class="m-5">
            <div class="grid grid-cols-2 bg-white p-5 gap-10">
                <div>
                    <div class="flex items-center space-x-3 mb-5">
                        <button><i class="icon-star-empty3 icon-2x"></i></button>
                        <div class="text-2xl">{{form.purchaseNo}}</div>
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
                    <th class="p-3 bg-gray-900 text-gray-50" style="width: 10%">WARNA</th>
                    <th class="p-3 bg-gray-900 text-gray-50 text-right" style="width: 10%">SIZE</th>
                    <th class="p-3 bg-gray-900 text-gray-50 text-right" style="width: 10%">PRICE</th>
                    <th class="p-3 bg-gray-900 text-gray-50 text-right" style="width: 10%">QTY</th>
                    <th class="p-3 bg-gray-900 text-gray-50 text-right" style="width: 10%">TOTAL</th>
                    <th class="p-3 bg-gray-900 text-gray-50 text-center" style="width: 5%">ACTION</th>
                </thead>
                <tbody class="divide-y bg-white">
                    <tr v-for="(item, i) in items" :key="i">
                        <td class="pl-5 py-3 pr-3">{{item.sku}}</td>
                        <td class="p-3">{{item.name}}</td>
                        <td class="p-3">{{item.warna}}</td>
                        <td class="p-3 text-right">{{item.size}}</td>
                        <td class="p-3 text-right">{{Intl.NumberFormat().format(item.price)}}</td>
                        <td class="p-3 text-right">{{item.qty}}</td>
                        <td class="p-3 text-right">{{Intl.NumberFormat().format(item.total)}}</td>
                        <td class="p-3 text-center hover:text-red-600"><button @click="onDeleteItem(item)"><i class="icon-trash text-red-500"></i></button></td>
                    </tr>
                </tbody>
            </table>
            <!-- IMAGES -->
            <div class="flex items-center mb-5 mt-2">
                <div class="w-full flex items-center space-x-5">
                    <draggable
                        :list="form.images"
                        :animation="200"
                        class="flex space-x-5"
                        ghost-class="border-red-600"
                        draggable=".item"
                    >
                        <div v-for="(element, i) in form.images" :key="i" class="relative w-40 h-40 rounded-sm border item">
                            <img :src="element" class="w-full" alt="">
                            <div class="list absolute flex items-end justify-end p-2 w-full h-full bg-black left-0 top-0 bg-opacity-0 opacity-0 transition cursor-move duration-300 hover:opacity-100 hover:bg-opacity-40">
                                <div class="flex items-center">
                                    <a @click.prevent="onRemoveImage(i)" href="#" class="flex justify-center items-center bg-white h-8 w-8 rounded-sm hover:text-red-500">
                                        <i class="icon-trash"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div  slot="footer" class="relative">
                            <div v-if="form.images.length < 5" class="group relative flex items-center justify-center w-40 h-40 rounded-sm border-2 border-dashed bg-gray-100">
                                <div class="">
                                    <i class="icon-stack-plus text-gray-300 icon-2x"></i>
                                </div>
                                <div class="absolute flex items-end justify-end w-full h-full bg-gray-300 left-0 top-0 bg-opacity-0 opacity-0 transition duration-400 hover:opacity-100 hover:bg-opacity-30">
                                    <input @input="onChangeFileImage" class="h-full w-full border opacity-0 cursor-pointer" type="file" multiple accept=".png, .jpg">
                                </div>
                            </div>
                        </div>
                    </draggable>
                </div>
            </div>
        </div>

        <!-- PRINT -->
        <div class="hidden">
            <div id="purchase" class="bg-white w-full" style="width: 210mm; height: 297mm">
                <div class="grid grid-cols-2">
                    <div>
                        <table class="w-full">
                            <tr>
                                <td class="py-1.5 font-semibold" style="width: 35%">NAMA BARANG</td>
                                <td class="py-1.5 pl-5">: {{form.remarks}} </td>
                            </tr>
                            <tr>
                                <td class="py-1.5 font-semibold">SUPPLIER</td>
                                <td class="py-1.5 pl-5">: {{supplierName}} </td>
                            </tr>
                            <tr>
                                <td class="py-1.5 font-semibold">Tgl. Permintaan</td>
                                <td class="py-1.5 pl-5">: {{getDate(form.invoiceDate)}}</td>
                            </tr>
                        </table>
                    </div>
                    <div class="relative">
                        <table class="w-full">
                            <tr>
                                <td class="py-1.5 font-semibold" style="width: 35%">NO PURCHASE</td>
                                <td class="py-1.5 pl-5">: {{form.purchaseNo}} </td>
                            </tr>
                            <tr>
                                <td class="py-1.5 font-semibold text-transparent">SUPPLIER</td>
                                <td class="py-1.5 pl-5"> </td>
                            </tr>
                            <tr>
                                <td class="py-1.5 font-semibold">Tgl. Diterima</td>
                                <td class="py-1.5 pl-5">:</td>
                            </tr>
                        </table>
                    </div>
                </div>
                <table class="w-full">
                    <thead class="border border-black">
                        <th class="bg-gray-900 p-3 text-gray-50 text-center" style="width: 10%">SKU</th>
                        <th class="bg-gray-900 p-3 text-gray-50 text-center">ITEM</th>
                        <th class="bg-gray-900 p-3 text-gray-50 text-center">WARNA</th>
                        <th class="bg-gray-900 p-3 text-gray-50 text-center">SIZE</th>
                        <th class="bg-gray-900 p-3 text-gray-50 text-center">PENGADAAN</th>
                        <th class="bg-gray-900 p-3 text-gray-50 text-center">CHECK</th>
                    </thead>
                    <tbody class="">
                        <tr v-for="(item, i) in items" :key="i">
                            <td class="px-3 py-1.5 border border-black">{{item.sku}}</td>
                            <td class="px-3 py-1.5 border border-black">{{item.name}}</td>
                            <td class="px-3 py-1.5 border border-black">{{item.warna}}</td>
                            <td class="px-3 py-1.5 border border-black text-center">{{item.size}}</td>
                            <td class="px-3 py-1.5 border border-black text-center">{{item.qty}}</td>
                            <td class="px-3 py-1.5 border border-black text-center"></td>
                        </tr>
                    </tbody>
                </table>
                <div class="mt-5">
                    <div class="grid grid-cols-3 gap-5">
                        <div v-for="(iamge, i) in form.images" :key="i" class="border border-gray-600 overflow-hidden rounded">
                            <img class=" w-full" :src="iamge">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Autocomplete from '../../components/Autocomplete.vue'
import Autonumeric from '../../components/Autonumeric.vue'
import DatePicker from 'v-calendar/src/components/DatePicker.vue'
import axios from 'axios'
import PrintJS from 'print-js'
import draggable from 'vuedraggable'
export default {
    components: {Autocomplete, Autonumeric, DatePicker, draggable},
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
                status: '',
                images: []
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
                const name = obj.name.split(" ")
                const warna = name.findIndex(obj => obj == 'Warna')
                const size = name.findIndex(obj => obj == 'Size')
                if(size > -1) {
                    obj.size = name[size + 1]
                }
                if(warna > -1) {
                    obj.warna = name[warna + 1]
                }
                return obj
            }).sort((a, b) => {
                let fa = a.name.toLowerCase(), fb = b.name.toLowerCase()
                if(fa > fb) {
                    return -1
                }
                if(fa < fb) {
                    return 1
                }
                return 0
            }) 
            return item.reverse()
        },
    },
    methods: {
        onPrint () {
            PrintJS({
                printable: 'purchase',
                type: 'html',
                targetStyles: ['*'],
                font_size: '14px'
            })
        },
        getDate (e) {
            const date = new Date(e)
            let d = date.getDate()
            let m = date.getMonth() + 1
            let y = date.getFullYear()
            d = checkTime(d)
            m = checkTime(m)
            function checkTime (e) {
                if(e < 10) {
                    return `0${e}`
                } else {
                    return e
                }
            }
            return `${d}/${m}/${y}`
        },
        getData () {
            axios.get('/purchases/detail/'+this.$route.params.id)
            .then(res => {
                this.form = res.data
                if(!this.form.images) {
                    this.form.images = []
                }
                this.supplierName = res.data.supplier
            })
        },
        onUpdate () {
            if(!this.form.supplierId) {
                this.err.supplierId = true
            }  
            if(this.form.supplierId) {
                this.isDisabled = true
                axios.put('/purchases/update/'+this.$route.params.id, this.form)
                .then(() => {
                    this.$router.push('/purchasing')
                })
            }
        },
        onSave (e) {
            this.form.status = e
            if(!this.form.supplierId) {
                this.err.supplier = true
            }
            if(this.form.supplierId) {
                this.isDisabled = true
                axios.put('/purchases/update/'+this.$route.params.id, this.form)
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
        },
        onChangeFileImage (e) {
            let app = this
            const file = e.currentTarget.files
            if(file.length + this.form.images.length > 5) {
                console.log('lebih dari tiga')
            } 
            if(file.length + this.form.images.length <= 5) {
                for (let i = 0; i < file.length; i++) {
                    const reader = new FileReader()
                    if(this.form.images.length < 5) {
                        reader.onload = () => {
                            app.form.images.push(reader.result)
                        }
                        reader.readAsDataURL(file[i])
                    }
                }
                e.target.value = ""
            }         
        },
        onRemoveImage (i) {
            this.form.images.splice(i,1)
        },
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

<style scoped>
@page {
        size: A4;
        margin: 0;
    }
@media print {
    html, body {
         width: 210mm;
            height: 297mm;        
        }
    }
</style>