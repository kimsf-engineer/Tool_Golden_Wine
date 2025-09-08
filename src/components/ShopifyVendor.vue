<template>
    <div>
        Danh sách nhà phân phối Shopify
    </div>
</template>
<script>
export default {
    name: 'ShopifyVendor',
    data() {
        return {
            vendors: [],
            is_loading: false,
            fields: [
                { key: 'index', label: 'STT', is_action: false },
                { key: 'title', label: 'Sản phẩm', is_action: false },
                { key: 'body_html', label: 'Thông tin', is_action: false },
                { key: 'images', label: 'images', is_action: false },
                { key: 'product_type', label: 'product_type', is_action: false },
                { key: 'vendor', label: 'vendor', is_action: false },
                { key: 'status', label: 'status', is_action: false },
                { key: 'tags', label: 'tags', is_action: false },
                { key: 'is_processing', label: 'is_processing', is_action: false },
                {
                    key: 'images', label: 'images',
                    variants: [
                        {
                            price: "",  // đơn vị là tiền tệ cửa hàng (VD: VND hoặc USD)
                            inventory_quantity: 1,
                            inventory_management: "shopify",
                            grams: 0,
                            weight: 0,
                            weight_unit: 'kg'
                        }
                    ],
                    is_action: false
                },
            ],
        };
    },
    mounted() {
        this.fetchVendors();
    },
    methods: {
        async fetchVendors() {
            try {
                this.is_loading = true;
                const res = await this.$axios.get('/shopify/vendors');
                this.vendors = res.data;
            } catch (err) {
                console.error(err);
            } finally {
                this.is_loading = false;
            }
        }
    }
};
</script>