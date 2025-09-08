<template>
    <div>
        <div class="modal fade" id="loading" tabindex="-1">
            <div class="modal-dialog modal-dialog-sm modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-body text-center">
                        <i class="fas fa-spinner fa-spin fa-2x"></i>
                        <p>Đang xử lý, vui lòng chờ...</p>
                    </div>
                   
                </div>
            </div>
        </div>
    </div>

</template>
<script>
export default {
    props: {
        is_loading: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
        };
    },
    watch: {
        'is_loading': function(newVal) {
            if (newVal) {
                this.show();
            } else {
                this.hide();
            }
        }
    },
    methods: {
        show() {
            $('#loading').modal('show');
        },
        hide() {
            $('#loading').modal('hide');
        }
    }
};
</script>