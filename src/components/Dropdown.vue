<template>
    <div
        @click.prevent="onShow" 
        @keydown.down.prevent="arrowDown" 
        @keydown.up.prevent="arrowUp"
        @keydown.enter.prevent="onEnter"
        class="inline-block relative">
        <slot :show="show"></slot>
        <transition name="dropdown" mode="out-in">
            <div    
                v-show="show" 
                ref="dropdown" 
                class="absolute transition ease-in-out transform duration-75 z-20 w-full bg-white border rounded-b-sm shadow-md max-h-80 overflow-y-auto"
                :class="[top ? 'bottom-full border-b-0 origin-bottom':'border-t-0 origin-top']">
                <a v-for="(item, i) in items" :key="i" href="#" @click.prevent="setValue(item.name)" :class="{'bg-gray-100' : i === rowCount,'text-red-500 font-semibold': value === item.name}" class="block px-3 py-1.5 hover:bg-gray-100">
                    <slot name="items" :item="item"></slot>
                </a>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    props: {
        items: {
            type: Array,
            default: () => []
        },
        value: String
    },
    mounted () {
        document.addEventListener('click', this.closMenu)
    },
    destroyed () {
        document.removeEventListener('click', this.closMenu)
    },
    data () {
        return {
            show: false,
            top: '',
            rowCount: -1
        }
    },
    methods: {
        onShow () {
            this.show = !this.show
        },
        closMenu ($event) {
            if(!$event || !this.$el.contains($event.target)) {
                this.show = false
            }
        },
        setValue(v) {
            this.$emit('input', v)
        },
        arrowDown () {
            if(this.rowCount < this.items.length) {
                this.rowCount = this.rowCount +1
            }
            if(this.rowCount > this.items.length-1) {
                this.rowCount = 0
            }
        },
        arrowUp () {
            if(this.rowCount > 0) {
                this.rowCount = this.rowCount -1
            }
        },
        onEnter () {
            if(this.rowCount >= 0) {
               this.$emit('input', this.items[this.rowCount].name)
               this.show = false
            }
        }
    },
    watch: {
        show (v) {
            this.rowCount = -1
            if(v) {
                let vm = this
                this.top = false
                this.$nextTick( () => {
                    let window_height = (window.innerHeight || document.documentElement.clientHeight)
                    let rect = vm.$refs.dropdown.getBoundingClientRect()
                    this.top = (rect.bottom > window_height - 200) && (rect.top >= rect.height)
                })
            }
        },
    }
}
</script>

<style scoped>
.dropdown-enter, .dropdown-leave-to {
    transform: scaleY(0);
}
</style>