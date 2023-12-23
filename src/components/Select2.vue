/* eslint-disable */
<template>
    <select :multiple="multiple">
        <slot></slot>
    </select>
</template>
<script>
import $ from 'jquery'
import 'select2/dist/js/select2.full'
function formatCustom(state) {
    if (!state.id) {
        return state.text;
    }

    return $(
            '<div><div class="font-semibold">' + state.text + '</div><div>'
                + $(state.element).attr('data-foo')
                + '</div></div>'
        );

    }
export default {
    props:['options','value','placeholder','multiple','button','buttonText', 'sort', 'parent'],
    mounted: function() {
        var vm = this;
        let htmlText = `<div class="py-4 text-right buttonAdd"><a id="buttonAdd" href="javascript:void(0)" class="border buttonAdd border-teal-500 text-teal-500 hover:bg-teal-50 rounded-sm px-3 py-2 m-4"> ${vm.buttonText}</a></div>`
        $(this.$el)
        // init select2
        .select2({ data: this.options, placeholder: vm.placeholder, dropdownParent: vm.parent})
        .val(this.value)
        .trigger("change")
        // emit event on change.
        .on('select2:select', function() {
            vm.$emit('input',$(this).val());
        })
        .on('select2:unselect', function () {
            vm.$emit('input',$(this).val());
        })
        .on('select2:open', function() {
            if(vm.button == true) {
                $(".select2-results:not(:has(a))").append(htmlText);
                vm.$nextTick(() => {
                    vm.onOpen()
                })
            } else {
                $(".select2-results:not(:has(a))").append('');
            }
        })
    },
	methods: {
        onOpen() {
            $('#buttonAdd').on('click', this.onClick)
        },
        onClick() {
            this.$emit('onAdd')
            this.close()
        },
		open () {
			$(this.$el).empty()
            $(this.$el).append('<option value=""></option>')
            $(this.$el).select2({ data: this.options, placeholder: this.placeholder })
			$(this.$el).select2('open')
        },
        close () {
            $(this.$el).select2('close')
        },
        clear() {
            $(this.$el).empty()
            $(this.$el).append('<option value=""></option>')
            $(this.$el).select2({ data: this.options, placeholder: this.placeholder })
        },
        templateResult () {
            $(this.$el).select2({templateResult: formatCustom, data: this.options, placeholder: this.placeholder})
        },
        update () {
            $(this.$el).val(this.value).trigger('change')
        }
	},
    watch: {
        value: function (value) {
            $(this.$el).val(value).trigger('change')
        },
        options:{
			handler() {
                // if(this.sort == 'asc') {
                //     this.options.sort((a, b) => {
                //         const aName = a.text.toUpperCase()
                //         const bName = b.text.toUpperCase()
                //         if(aName < bName) {
                //             return -1
                //         }
                //         if(aName > bName) {
                //             return 1
                //         }
                //         return 0
                //     })
                // }
                // if(this.sort == 'desc') {
                //     this.options.sort((a, b) => {
                //         const aName = a.text.toUpperCase()
                //         const bName = b.text.toUpperCase()
                //         if(aName > bName) {
                //             return -1
                //         }
                //         if(aName < bName) {
                //             return 1
                //         }
                //         return 0
                //     })
                // }
                this.clear()
			},
			deep: true
			
        }
    },
    destroyed: function() {
    $(this.$el)
      .off()
      .select2("destroy");
  }
}
</script>
