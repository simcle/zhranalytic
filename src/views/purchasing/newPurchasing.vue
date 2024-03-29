<template>
    <div class="m-5 justify-center">
        <div class="flex justify-between items-center mb-5">
            <div class="font-semibold">Request for Quotation</div>
            <button @click="onSave" class="h-9 px-5 rounded bg-green-500 text-green-50 hover:bg-green-600" :disabled="isDisabled">SAVE</button>
        </div>
        <div class="grid grid-cols-2 bg-white p-5 gap-10">
            <div>
                <div class="flex items-center space-x-3 mb-5">
                    <button><i class="icon-star-empty3 icon-2x"></i></button>
                    <div class="text-2xl">New</div>
                </div>
                <div>
                    <span>SUPPLIER</span>
                    <div class="flex flex-col mt-3">
                        <autocomplete v-model="supplier" :err="err.supplier" @onCreate="onCreateSupplier($event)" @input="onSelectSupplier($event)" :placeholder="'Pilih supplier'" :url="'/purchases/suppliers'">
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
                    <td class="p-3 text-center hover:text-red-600"><button @click="onDeleteItem(item.productId)"><i class="icon-trash text-red-500"></i></button></td>
                </tr>
            </tbody>
        </table>

        <!-- IMAGES -->
        <div class="flex items-center mb-5 mt-2">
            <div class="w-full flex items-center space-x-5">
                <draggable
                    :list="images"
                    :animation="200"
                    class="flex space-x-5"
                    ghost-class="border-red-600"
                    draggable=".item"
                >
                    <div v-for="(element, i) in images" :key="i" class="relative w-40 h-40 rounded-sm border item">
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
                        <div v-if="images.length < 5" class="group relative flex items-center justify-center w-40 h-40 rounded-sm border-2 border-dashed bg-gray-100">
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
        <div v-show="alert" class="absolute right-5 px-3 py-2 rounded bg-gray-900 bottom-0 text-center">
            <div class="flex items-center space-x-3">
                <i class="icon-warning text-red-500"></i>
                <div class="text-gray-100">This item already exists</div>
                <button @click="alert = false"><i class="icon-cross3 text-gray-100"></i></button>
            </div>
        </div>
    </div>
</template>

<script>
import Autocomplete from '../../components/Autocomplete.vue'
import Autonumeric from '../../components/Autonumeric.vue'
import DatePicker from 'v-calendar/src/components/DatePicker.vue'
import draggable from 'vuedraggable'
import axios from 'axios'
export default {
    components: {Autocomplete, Autonumeric, DatePicker, draggable},
    data () {
        return {
            isDisabled: false,
            supplier: '',
            sku: '',
            alert: false,
            images: [],
            item: {
                productId: '',
                sku: '',
                name: '',
                price: '',
                qty: '',
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
        onSave () {
            if(!this.form.supplierId) {
                this.err.supplier = true
            }
            if(this.form.supplierId) {
                this.isDisabled = true
                this.form.images = this.images
                axios.post('/purchases', this.form)
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
                    this.form.items.push(this.item)
                    this.item = {
                        productId: '',
                        sku: '',
                        name: '',
                        price: '',
                        qty: '', 
                    }
                    this.sku = ''
                    this.$refs.sku.focus()
                } else {
                    this.alert = true
                }
            }
        },
        onDeleteItem (i) {
            let idx = this.form.items.findIndex(obj => obj.productId == i)
            this.form.items.splice(idx, 1)
            this.$refs.sku.focus()
        },
        onCreateSupplier () {

        },
        onSelectSupplier (e) {
            this.form.supplierId = e._id
            this.err.supplier = ''
        },
        //  IMAGES FUNCTION
        onChangeFileImage (e) {
            let app = this
            const file = e.currentTarget.files
            if(file.length + this.images.length > 5) {
                console.log('lebih dari tiga')
            } 
            if(file.length + this.images.length <= 5) {
                for (let i = 0; i < file.length; i++) {
                    const reader = new FileReader()
                    if(this.images.length < 5) {
                        reader.onload = () => {
                            app.images.push(reader.result)
                        }
                        reader.readAsDataURL(file[i])
                    }
                }
                e.target.value = ""
            }         
        },
        onRemoveImage (i) {
            this.images.splice(i,1)
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
                    qty: '' 
                }
            }
        }
    }
}
</script>