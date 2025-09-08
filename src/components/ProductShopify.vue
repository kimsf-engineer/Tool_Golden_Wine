<template>
    <div>
        <div class="form-group">
            <div class="form-group mb-2">
                <button class="btn btn-sm btn-outline-secondary px-2 rounded-pill mr-2" v-for="(tag, index) in tags"
                    :key="index" @click="fetchProducts(tag.key)" :class="{
                        'active': tag.key === tag_name,
                    }">
                    <small>{{ tag.name }}</small>
                </button>
                <small class="float-right font-weight-bold">Items: {{ products.length }}</small>
            </div>
            <button class="btn btn-sm btn-success px-2 border" @click="exportExcel()">Export Excel</button>
            <div class="table-responsive">
                <table class="table table-bordered table-striped table-hover table-sm table-small">
                    <thead>
                        <tr>
                            <th v-for="(field, index) in fields" :key="index">
                                {{ field.label }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(product, index) in products" :key="index">
                            <td v-for="(field, index_field) in fields" :key="index_field">
                                <span v-if="field.key !== 'variants'">{{ product[field.key] }}</span>
                                <span v-show="field.key === 'index'">
                                    {{ index + 1 }}
                                </span>
                                <div v-if="field.is_action" class="btn-group">
                                    <button class="btn btn-primary btn-sm" @click="editProduct(product.id)">Sửa</button>
                                    <button class="btn btn-danger btn-sm"
                                        @click="deleteProduct(product.id)">Xóa</button>
                                </div>
                                <div class="form-group" v-if="field.key === 'variants'">
                                    <div class="row" v-for="(variant, variantIndex) in product[field.key]"
                                        :key="variantIndex">
                                        <div class="col-lg-3">
                                            <small>{{ field.child.label }}</small>
                                        </div>
                                        <div class="col-lg-9">
                                            <input type="text" class="form-control form-control-sm"
                                                v-model="variant.price" />
                                        </div>
                                    </div>

                                </div>
                            </td>
                            <!-- Add more fields as needed -->
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <DialogLoading :is_loading="is_loading" />
    </div>
</template>
<script>
import * as XLSX from 'xlsx';
export default {
    name: 'ProductShopify',
    data() {
        return {
            products: [],
            fields: [
                { key: 'index', label: 'STT', is_action: false },
                { key: 'title', label: 'Tên sản phẩm', is_action: false },
                // { key: 'body_html', label: 'Thông tin', is_action: false },
                { key: 'product_type', label: 'Loại', is_action: false },
                { key: 'tags', label: 'Tag', is_action: false },
                {
                    key: 'variants', label: 'Variant', child: {
                        key: 'price', label: 'Giá tiền'
                    }, is_action: false
                },
                { key: 'action', label: 'Hành động', is_action: true },

                // Add more fields as needed
            ],
            tags: [
                { key: '', name: 'ALL' },
                { key: 'whiskey', name: 'WHISKEY' },
                { key: 'vodka', name: 'VODKA' },
                { key: 'cognac', name: 'COGNAC' },
                { key: 'liqueur & tequila', name: 'LIQUEUR & TEQUILA' },
                { key: 'gin', name: 'GIN' },
                { key: 'rum', name: 'RUM' }
            ],
            is_loading: false,
            tag_name: 'whiskey'
        };
    },
    mounted() {
        this.fetchProducts();
    },
    methods: {
        async fetchProducts(tag_name = 'whiskey') {
            try {
                this.is_loading = true;
                const res = await this.$axios.get('/shopify/products', {
                    params: {
                        product_type: tag_name,
                    }
                });
                this.products = res.data.products;
                console.log(res.data);

            } catch (err) {
                console.error(err);
            } finally {
                this.is_loading = false;
                this.tag_name = tag_name;
                this.$toastr.success(`Đã tải ${this.products.length} sản phẩm với tag: ${tag_name}`);
            }
        },
        exportExcel() {
            // Chuyển dữ liệu sang dạng sheet
            const ws = XLSX.utils.json_to_sheet(this.products);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            // Xuất file
            XLSX.writeFile(wb, 'sanp.xlsx');
        },
    }
};
</script>