<template>
    <div class="static">
        <div @click="onFocus(true)" class="flex justify-end cursor-pointer items-center">
            <input :disabled="isDisabled" @keydown="onSearch" @keydown.tab="onTab" @keydown.down.prevent="arrowDown" @keydown.up.prevent="arrowUp" @keydown.enter.prevent="onEnter" ref="search" v-model="search" type="text" name="seacrh_pedagang" class="w-full cursor-pointer h-9 pr-4 border-b focus:outline-none focus:border-teal-500" :class="[{'border-red-500': err, 'border-teal-500': show}, styleClass]" :placeholder="placeholder" autocomplete="off">
            <span class="absolute">
                <i class="icon-arrow-down22 text-gray-300" :class="{'text-teal-500': focus, 'text-teal-500': show}"></i>
            </span>
        </div>
        <ul ref="dropdown" v-show="show && !isDisabled" class="absolute py-2 z-10 bg-white w-auto border rounded-b-sm shadow-lg max-h-72 overflow-auto border-t-0">
            <li v-for="(item, i) in items" :key="i" :ref="'list'+i" @click="onSelect(i)" @mouseover="onMouseOver(i)" @mouseleave="onMouseLeave" class="px-5 py-1 text-sm cursor-pointer transition duration-200" :class="{'bg-gray-100': i === rowCount}">
                <slot :item="item"></slot>
            </li>
            <li v-if="items.length > 0" @click="$emit('onSearchMore')" class="pl-10 py-1 text-sm cursor-pointer transition duration-200 hover:bg-gray-100 text-teal-500">
                Search More...
            </li>
            <li v-if="search && items.length == 0" @click="$emit('onCreate', search)" class="pl-10 py-1 text-sm cursor-pointer transition duration-200 hover:bg-gray-100 text-teal-500">
                Create "{{search}}"
            </li>
            <!-- <li v-if="search" @click="$emit('onEdit', search)" class="pl-10 py-1 text-sm cursor-pointer transition duration-200 hover:bg-gray-100 text-teal-500">
                Create & Edit...
            </li> -->
            <li v-if="!search && items.length > 4" class="pl-10 text-sm italic py-1 text-gray-400">
                Start typing...
            </li>
        </ul>
    </div>
</template>

<script>
import axios from 'axios'
import debounce from 'lodash.debounce'
export default {
    props: ['url','value','placeholder','text','err', 'label', 'notin', 'options', 'isDisabled', 'styleClass'],
    data () {
        return {
            showModalCustomer: false,
            customers: [],
            show: false,
            isLoading: false,
            search: '',
            items: [],
            rowCount: 0,
            item: '',
            searchData: '',
            focus: false
        }
    },
    created() {
        this.searchData = debounce(() => {
            if(this.search.length < 1) {
                this.rowCount = 0
            }
            if(this.search.length >= 0 && this.show) {
                this.getData()
            }
        }, 100)
    },
    mounted () {
        window.addEventListener('click', this.closeMenu)
        let widthDropdown = this.$refs.search.clientWidth+'px'
        this.$refs.dropdown.style.minWidth = widthDropdown
    },
    destroyed () {
        window.removeEventListener('click', this.closeMenu)
    },
    methods: {
        onFocus (i) {
            this.focus = i
            if(i) {
                this.show = true
                this.getData()
                this.$refs.search.focus()
            }
        },
        setFocus () {
            this.$refs.search.focus()
        },
        onSearch (e) {
            if(e.keyCode !== 40 && e.keyCode !== 38 && e.keyCode !== 13 ) {
                this.show = true
                this.searchData()
            }
        },
        getData () {
            this.isLoading = true
            axios.get(this.url, {
                params: {
                    search: this.search,
                    notin: this.notin
                }
            })
            .then((res) => {
                this.isLoading = false
                this.items = res.data
                this.rowCount = 0
                if(res.data.length > 0) {
                    let widthDropdown = this.$refs.search.clientWidth+'px'
                    this.$refs.dropdown.style.minWidth = widthDropdown
                }
            })
            .catch(() => {
                this.isLoading = false
            })
        },
        onSelect (i) {
            this.$emit('input', this.items[i])
            this.show = false
        },  
        onEnter () {
            if(this.rowCount >= 0 && this.show && this.items.length > 0) {
                this.$emit('input', this.items[this.rowCount])
                this.show = false
            }
        },
        onTab () {
            this.closeMenu()
        },
        onMouseOver (i) {
            this.rowCount = i
        },
        onMouseLeave () {
            this.rowCount = 0
        },
        arrowDown () {
            this.show = true
            if(this.rowCount < this.items.length && this.items.length > 0 && this.show) {
                const menuHeight = this.$refs.dropdown.clientHeight
                const scrollTop = this.$refs.dropdown.scrollTop
                this.rowCount = this.rowCount +1
                this.$nextTick(() => {
                    const top = this.$refs['list'+this.rowCount][0].offsetTop
                    const height = this.$refs['list'+this.rowCount][0].getBoundingClientRect()
                    if((top+height.height) > (menuHeight + scrollTop)) {
                        this.$refs.dropdown.scrollTop = (top + height.height) - menuHeight
                    }
                })
            }
            if(this.rowCount > this.items.length-1 && this.show) {
                this.rowCount = 0
                this.$refs.dropdown.scrollTop = 0
            }
        },
        arrowUp () {
            if(this.rowCount > 0 && this.show) {
                const menuHeight = this.$refs.dropdown.scrollTop
                this.rowCount = this.rowCount -1
                this.$nextTick(() => {
                    const top = this.$refs['list'+this.rowCount][0].offsetTop
                    if(top < menuHeight) {
                        this.$refs.dropdown.scrollTop = top
                    }
                })
            }
        },
        closeMenu (e) {
            if(!e || !this.$el.contains(e.target)) {
                if(!this.value && !this.label) {
                    this.search = ''
                } else {
                    this.search = this.value.displayName || this.value.name || this.value.company || this.label
                }
                this.show = false
            }
        }
    },
    watch: {
        value (val) {
            if(val) {
                this.search = val.displayName || val.name || val.company
            } else {
                this.search = ''
            }
        },
        search (val) {
            this.$refs.dropdown.scrollTop = 0
            if(!val) {
                this.$emit('input', '')
            }
        },
        label (val) {
            if(val) {
                this.search = val
            }
        }
    }
}
</script>