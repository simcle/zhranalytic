<template>
    <div>
        <transition name="modal" mode="out-in">
            <div v-show="show" class="fixed inset-0 z-50 overflow-y-auto">
                <div class="flex justify-center">
                    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" aria-hidden="true"></div>
                    <transition name="slide" >
                        <div v-show="show" class="transform flex justify-center my-8 w-full">
                            <slot></slot>
                        </div>
                    </transition>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
export default {
    props: {
        show: Boolean
    }
}
</script>