<template>
    <div>
        <div class="row">
            <div class="col-lg-4">
                <div class="form-group">
                    <label for="">Nhà cung cấp</label>
                    <select class="form-control form-control-sm" name="" id="" v-model="vendor_link"
                        @change="handleVendor()">
                        <option v-for="(vendor, index) in vendors" :key="index" :value="vendor.link">
                            {{ vendor.name }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="col-lg-8">
                <div class="row">
                    <div class="col-lg-3">
                        <label for="" class="font-weight-bold">Lấy Link Sản Phẩm</label>
                    </div>
                    <div class="col-lg-9">
                        <input type="file" accept=".html" @change="onFileChangeLink" multiple />
                        <button @click="downloadAll()" class="btn btn-sm btn-primary px-2">downHTML</button>
                        <button class="btn btn-sm btn-info px-2 border" @click="copyLinkClipboard()">Copy
                            link</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="form-group">
            <div class="row">
                <div class="col-lg-12">
                    <div class="form-group">
                        <div class="row">
                            <div class="col-lg-2 text-left ml-4">
                                <label for="" class="font-weight-bold">Xử lý HTML</label>
                            </div>
                            <div class="col-lg-8 text-left">
                                <input class="form-group form-group-sm" type="file" accept=".html"
                                    @change="onFileChange" multiple />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <div v-for="(title, index) in link_hrefs" :key="index">
            <p>{{ index + 1 }}. {{ title }}</p>
        </div>
        <div class="form-group text-right mb-1">
            <div class="row">
                <div class="col-lg-3">
                    <small><u>Xử lý dữ liệu vào SHOPIFY: </u></small>
                    <span class="badge"
                        :class="count === results.length ? 'badge-sm badge-success font-weight-bold' : 'badge-danger'">{{
                            count }} / {{
                            results.length }}</span>
                </div>
                <div class="col-lg-3">
                    <small><u>Xử lý hình ành: </u></small>
                    <span class="badge"
                        :class="count_images === results.length ? 'badge-sm badge-success font-weight-bold' : 'badge-danger'">{{
                            count_images }} / {{
                            results.length }}</span>
                </div>
                <div class="col-lg-6">
                    <div class="form-group text-right">
                        <button class="btn btn-sm btn-info px-2 mr-2" @click="chatGoogle()">Chat Google</button>
                        <button class="btn btn-sm btn-danger px-2 mr-2" @click="demo()">Xóa Logo Ảnh</button>
                        <button class="btn btn-sm btn-warning px-2 mr-2" @click="uploadImageLinks()">PUSH Ảnh
                            Cloud</button>
                        <button class="btn btn-sm btn-success px-2 mr-2" @click="saveAllProducts()">PUSH
                            Shopify</button>
                        <button class="btn btn-sm btn-success px-2 border" @click="exportExcel()">Export Excel</button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="results">
            <div class="table-reponsive">
                <table class="table table-bordered text-small">
                    <thead>
                        <tr class="text-nowrap">
                            <th>STT</th>
                            <th class="text-left">Sản phẩm</th>
                            <th class="text-left">Hình ảnh</th>
                            <th class="text-left">Giá tiền</th>
                            <th class="text-left">Loại</th>
                            <th class="text-left">Tags</th>
                            <th class="text-left">Dung tích</th>
                            <th class="text-left">Đơn vị tính</th>
                            <th class="text-left">Thông tin</th>
                            <th class="text-left">Mô tả chi tiết</th>
                            <!-- <th class="text-center">Hành động</th> -->
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(result, index) in results" :key="index">
                            <td class="text-bold">{{ index + 1 }}</td>
                            <td class="text-left">{{ result.title }}</td>
                            <td class="text-bold">
                                <label class="text-break badge"
                                    :class="result.is_processing == true ? 'badge-success' : 'badge-danger'" for="">{{
                                        result.is_processing }}</label></br>
                                <div class="" v-for="(img, imgIndex) in result.images" :key="imgIndex">
                                    <img :src="img.src" alt="Image" style="max-width: 50px; max-height: 50px;" />
                                    <!-- <label class="text-break" for="">{{ result.is_processing }}</label></br> -->
                                </div>
                            </td>
                            <td class="text-left text-danger">
                                <input type="text" v-model="result.variants[0].price"
                                    class="form-control form-control-sm" placeholder="Giá tiền" />
                            </td>
                            <td class="text-left text-danger">
                                <input type="text" v-model="result.product_type"
                                    @input="inputIndexField(index, 'product_type')" class="form-control form-control-sm"
                                    placeholder="Loại sản phẩm" />
                            </td>
                            <td class="text-left text-danger">
                                <input type="text" v-model="result.tags" @input="inputIndexField(index, 'tags')"
                                    class="form-control form-control-sm" placeholder="Tags" />
                            </td>
                            <td class="text-left">
                                <input type="text" v-model="result.variants[0].weight"
                                    class="form-control form-control-sm" placeholder="Dung tích (ml)" />
                            </td>
                            <td class="text-left">{{ result.variants[0].weight_unit }}</td>
                            <td class="text-left">{{ result.body_html }}</td>
                            <td class="text-left">{{ result.detail }}</td>
                            <!-- <td class="text-left">{{ result.body_html }}</td> -->
                            <td class="text-nowrap">
                                <!-- <button class="btn btn-sm btn-success mr-2">Xuất Excel</button>
                                <button class="btn btn-sm btn-danger">PUSH</button> -->
                                <button class="btn btn-sm btn-danger" @click="deleteResultId(index)">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <DialogLoading :is_loading="is_loading_parent" />
    </div>
</template>

<script>
import axios from 'axios';
import * as XLSX from 'xlsx';
import DialogLoading from './DialogLoading.vue';

export default {
    components: {
        DialogLoading
    },
    data() {
        return {
            vendor_link: '',
            processing_domain: 'https://hedon.com.vn',
            selectedFile: null,
            resultImage: null,
            message: 'Hello Vue!',
            imageUrl: "https://hedon.com.vn/wp-content/uploads/2024/11/Ruou-vang-Phap-Louis-Eschenauer-Merlot.avif",
            results: [
                {
                    title: '',
                    price: '',
                    detail: '',
                    body_html: '',
                    images: [],
                    product_type: "Vang ngọt",
                    vendor: "Golden Wine",
                    status: "active",
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
                    tags: "Vang ngọt",
                    is_processing: false,
                }
            ],
            imgLinks: [],
            link_hrefs: [],
            is_loading_parent: false,
            count: 0,
            count_images: 0,
            vendors: [
                {
                    name: 'Hedon', link: 'https://hedon.com.vn'
                },
                {
                    name: 'Golden Wine', link: 'https://goldenwine.vn'
                },
                {
                    name: 'Envang', link: 'https://envang.vn'
                },
                {
                    name: 'Ruouchuan', link: 'https://ruouchuan.vn/'
                }
            ]

        };
    },
    mounted() {
        // this.removeLogo();
        // const originalUrl = "https://hedon.com.vn/wp-content/uploads/2024/11/Ruou-vang-Y-Primitivo-Puglia-IGT-Collezione-Beatrice.avif";
        // this.imageUrl = `http://localhost:3002/proxy-image?url=${encodeURIComponent(originalUrl)}`;
        // this.removeLogo();
        // console.log('Image URL:', this.imageUrl);
    },
    methods: {
        handleVendor() {
            // Xử lý khi người dùng chọn nhà cung cấp
            console.log('Selected vendor link:', this.vendor_link);
        },
        inputIndexField(index, field) {
            // Xử lý khi người dùng nhập tags
            const value = this.results[index][field];
            if (value) {
                // Chia tags thành mảng nếu có dấu phẩy
                // this.results[index].tags = tags.split(',').map(tag => tag.trim()).join(', ');
                this.results.forEach((result, i) => {
                    result[field] = value
                });
            }
        },
        deleteResultId(index) {
            this.results.splice(index, 1);
        },
        async chatGoogle() {
            const productNames = this.results
                .filter(r => r.title)
                .map(r => r.title);

            try {
                const response = await fetch('http://localhost:5000/product-info', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ products: productNames })
                });

                const data = await response.json();
                console.log("Gemini batch response:", data);

                // Map kết quả trả về lại vào this.results
                data.results.forEach(res => {
                    const item = this.results.find(r => r.title === res.name);
                    if (item) item.body_html = res.info || "";
                });

            } catch (error) {
                console.error('Error fetching Gemini batch response:', error);
            }
        },


        onFileChangeDemo(e) {
            this.selectedFile = e.target.files[0];
        },
        async demo() {
            const numGroups = 3; // Số request song song tối đa
            const queue = [...this.results]; // copy mảng kết quả
            let running = 0; // số nhóm đang chạy

            // Hàm xử lý 1 ảnh
            const processImage = async (result, img) => {
                try {
                    const res = await fetch('http://localhost:5000/remove-bg', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ url: img.src })
                    });

                    if (!res.ok) throw new Error('Xóa nền thất bại');

                    const data = await res.json();
                    img.src = data.image_base64;
                    result.is_processing = true;
                    this.count_images++;
                } catch (err) {
                    console.error(`❌ Lỗi khi xử lý ảnh:`, err);
                }
                await this.delay(600); // delay giữa các ảnh
            };

            // Hàm xử lý luồng công việc (worker)
            const worker = async (workerIndex) => {
                running++;
                console.log(`▶ Worker ${workerIndex + 1} bắt đầu`);
                while (queue.length > 0) {
                    const result = queue.shift(); // lấy 1 phần tử từ hàng đợi
                    if (!result) break;

                    for (const img of result.images) {
                        await processImage(result, img);
                    }
                }
                console.log(`✅ Worker ${workerIndex + 1} hoàn thành`);
                running--;
            };

            // Tạo numGroups worker chạy song song
            await Promise.all(Array.from({ length: numGroups }, (_, i) => worker(i)));

            console.log("🎉 Hoàn thành tất cả ảnh!");
        },



        // async demo() {
        //     if (!this.selectedFile) {
        //         alert('Vui lòng chọn ảnh trước');
        //         return;
        //     }

        //     const formData = new FormData();
        //     formData.append('image', this.selectedFile);

        //     try {
        //         const res = await fetch('/remove-bg', {
        //             method: 'POST',
        //             body: formData
        //         });

        //         if (!res.ok) {
        //             throw new Error(`HTTP error! status: ${res.status}`);
        //         }

        //         const blob = await res.blob(); // Lấy dữ liệu ảnh trả về
        //         this.resultImage = URL.createObjectURL(blob);
        //         console.log('Ảnh đã xóa nền:', this.resultImage);
        //     } catch (err) {
        //         console.error('Lỗi khi xóa nền:', err);
        //     }
        // },
        removeLogo() {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = () => {
                const canvas = this.$refs.canvas;
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);

                // Xác định vùng logo (ví dụ: 0,0 đến 120x60)
                ctx.fillStyle = "#fff"; // hoặc màu nền phù hợp
                ctx.fillRect(0, 0, 120, 60); // chỉnh lại kích thước cho vừa logo

                // Nếu muốn làm mờ vùng logo thay vì fill trắng:
                // ctx.globalAlpha = 0.7;
                // ctx.fillRect(0, 0, 120, 60);
                // ctx.globalAlpha = 1;
            };
            img.src = this.imageUrl;
        },
        downloadImage() {
            const canvas = this.$refs.canvas;
            const link = document.createElement("a");
            link.download = "image_no_logo.png";
            link.href = canvas.toDataURL("image/png");
            link.click();
        },
        extractVolume(body_html) {
            // Tìm dòng chứa "Dung tích" và số ml
            const regex = /Dung tích[:\s]*([\d,.]+)\s*ml/i;
            const match = body_html.match(regex);

            if (!match) return null;

            // Xử lý số ml, loại bỏ dấu phẩy/chấm nếu có
            const ml = parseInt(match[1].replace(/[,.]/g, ''));
            const grams = ml; // giả định: 1ml ≈ 1g
            const weight = +(grams / 1000).toFixed(3); // kg, làm tròn 3 số

            return {
                grams,
                weight,
                weight_unit: 'kg'
            };
        },
        async uploadImageLinks() {
            this.is_loading_parent = true;
            try {
                const res = await fetch('http://localhost:3001/shopify/upload-images', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.results) // mảng bạn có
                });

                const data = await res.json();
                console.log('Ảnh đã được upload lên Cloudinary:', data);

                // Lưu lại hoặc dùng để tạo sản phẩm Shopify
                // this.products = data;
                this.results = data;
            } catch (err) {
                console.error('Upload ảnh thất bại:', err);
            } finally {
                this.is_loading_parent = false;
            }
        },
        viewProductID() {
            const productId = '9983507005721'; // hoặc truyền vào nếu muốn dynamic
            fetch(`http://localhost:3001/shopify/products-by-id?ids=${productId}`)
                .then(res => {
                    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
                    return res.json();
                })
                .then(data => {
                    console.log('Product data:', data.products[0]); // Vì API trả về mảng
                })
                .catch(err => {
                    console.error('Fetch error:', err);
                });
        },
        addProduct() {
            const productData = {
                product: {
                    title: "Demo Product",
                    body_html: "<strong>This is a demo</strong>",
                    vendor: "My Store",
                    product_type: "whiskey",
                    status: "active",
                    variants: [
                        {
                            "price": "1250000",  // đơn vị là tiền tệ cửa hàng (VD: VND hoặc USD)
                            "inventory_quantity": 1,
                            "inventory_management": "shopify",
                        }
                    ],
                    tags: "whiskey",
                    images: [
                        {
                            // src: "https://envang.vn/wp-content/uploads/2025/06/ABL1201-1.jpg",
                            src: "https://envang.vn/wp-content/uploads/2025/06/ABL1201-1.jpg",
                        },
                        {
                            src: "https://envang.vn/wp-content/uploads/2025/06/ABL1201_01-1.jpg",
                        },
                        {
                            src: "	https://envang.vn/wp-content/uploads/2025/06/ABL1201_02-1.jpg",
                        }
                    ]
                }
            };
            const product = {
                product: {
                    ...this.results[0],
                }
            }
            fetch('http://localhost:3001/shopify/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(product)
            })
                .then(res => res.json())
                .then(data => {
                    console.log('Created product:', data.product);
                })
                .catch(err => console.error('Error:', err));
        },
        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
        async saveAllProducts() {
            for (const item of this.results) {
                const product = {
                    product: {
                        ...item
                    }
                };

                try {
                    const res = await fetch('http://localhost:3001/shopify/products', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(product)
                    });

                    const data = await res.json();
                    this.count++;
                } catch (err) {
                    console.error('❌ Error creating product:', err);
                }

                // Chờ 600ms trước khi tiếp sản phẩm tiếp theo
                await this.delay(600);
            }
        },
        fetchProduct() {
            fetch('http://localhost:3001/shopify/categories')
                .then(res => res.json())
                .then(data => {
                    console.log('shopify/categories:', data);
                })
                .catch(err => console.error('Fetch error:', err));
        },
        exportExcel() {
            // Chuyển dữ liệu sang dạng sheet
            const ws = XLSX.utils.json_to_sheet(this.results);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            // Xuất file
            XLSX.writeFile(wb, 'products.xlsx');
        },
        addLink() {
            this.link_hrefs.push('');
        },
        copyLinkClipboard() {
            const text = this.link_hrefs.map(link => `"${link}",`).join('\n');
            navigator.clipboard.writeText(text).then(() => {
                alert('Đã sao chép vào clipboard!');
            }).catch(err => {
                console.error('Không thể sao chép:', err);
            });
        },
        async downloadAll() {
            for (const link of this.link_hrefs) {
                try {
                    const response = await axios.get(link);
                    const blob = new Blob([response.data], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = link.split('/').filter(Boolean).pop() + '.html';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                } catch (err) {
                    console.log('Lỗi với link:', link, err.message);
                }
            }
        },
        async downloadHTML() {
            // Sử dụng proxy trung gian để tránh lỗi CORS
            this.link_hrefs.forEach(async (link) => {
                let proxy = 'https://api.allorigins.win/get?url=' + encodeURIComponent(link);
                try {
                    const response = await fetch(proxy);
                    const data = await response.json();
                    const html = data.contents; // Lấy nội dung HTML từ phản hồi
                    const blob = new Blob([html], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'page.html';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                } catch (error) {
                    alert('Không thể tải HTML do bị chặn proxy hoặc lỗi mạng!');
                }
            });
        },
        onFileChangeLink(event) {
            const files = event.target.files;
            if (!files.length) return;
            this.link_hrefs = [];
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const html = e.target.result;
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    switch (this.vendor_link) {
                        case 'https://ruouchuan.vn/':
                            // Lấy tất cả thẻ a trong class product-small box
                            const product_link_vendor = doc.querySelectorAll('a.full-unstyled-link');
                            let uniqueLinks = new Set();

                            product_link_vendor.forEach(link => {
                                if (link && link.href.includes('/products/')) {
                                    uniqueLinks.add(link.href); // Set tự loại trùng
                                }
                            });

                            // Chuyển Set -> mảng và push vào this.link_hrefs
                            this.link_hrefs.push(...Array.from(uniqueLinks));

                            console.log('Số link sản phẩm:', this.link_hrefs.length);
                            console.log('Danh sách:', this.link_hrefs);

                            break;
                        case 'https://hedon.com.vn':
                            const links = doc.querySelectorAll('a.woocommerce-LoopProduct-link.woocommerce-loop-product__link');
                            links.forEach(link => {
                                const text = link.textContent.replace(/[\n\t]/g, '').trim();
                                if (text) {
                                    // Loại bỏ dấu tiếng Việt và ký tự đặc biệt
                                    let url_text = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                                    url_text = url_text.replace(/[^a-zA-Z0-9\s-]/g, ''); // chỉ giữ lại chữ, số, khoảng trắng, dấu -
                                    url_text = url_text.replace(/\s+/g, '-').toLowerCase(); // thay khoảng trắng bằng -
                                    const formattedUrl = 'https://hedon.com.vn/' + url_text + '/';
                                    this.link_hrefs.push(formattedUrl);
                                }
                            });
                            break;
                        default:
                            const productLinks = doc.querySelectorAll('.image-fade_in_back a');
                            productLinks.forEach(link => {
                                console.log('Link:', link);
                                const href = link.href;
                                if (href) {
                                    this.link_hrefs.push(href);
                                }
                            });
                            break;
                    }
                    // tìm class product-small box quét lấy thẻ a có link href
                };
                reader.readAsText(file);
                console.log(this.link_hrefs);
            });
        },
        onFileChange(event) {
            const files = event.target.files;
            if (!files.length) return;
            this.results = [];
            this.imgLinks = [];
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const html = e.target.result;
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');

                    let result = {
                        title: '',
                        price: '',
                        detail: '',
                        body_html: '',
                        images: [],
                        product_type: "Vang ngọt",
                        vendor: "Golden Wine",
                        status: "active",
                        variants: [
                            {
                                "price": "1250000",  // đơn vị là tiền tệ cửa hàng (VD: VND hoặc USD)
                                "inventory_quantity": 1,
                                "inventory_management": "shopify",
                            }
                        ],
                        tags: "Vang ngọt",
                        is_processing: false,
                    }
                    switch (this.vendor_link) {
                        case 'https://hedon.com.vn':
                            // lấy class woocommerce-product-attributes shop_attributes
                            const attributes = doc.querySelector('.woocommerce-product-attributes.shop_attributes');
                            if (attributes) {
                                // lấy tất cả text trong th và td vào biến result.body_html
                                const rows = attributes.querySelectorAll('tr');
                                let attrTexts = [];
                                rows.forEach(row => {
                                    const th = row.querySelector('th');
                                    const td = row.querySelector('td');
                                    const label = th ? th.innerText.replace(/[\n\t]/g, '').trim() : '';
                                    const value = td ? td.innerText.replace(/[\n\t]/g, '').trim() : '';
                                    if (label && value) {
                                        attrTexts.push(`${label}: ${value}`);
                                    }
                                });
                                result.body_html = attrTexts.join('\n');
                                const weightInfo = this.extractVolume(result.body_html);
                                if (weightInfo) {
                                    result.variants[0].grams = weightInfo.grams;
                                    result.variants[0].weight = weightInfo.weight;
                                    result.variants[0].weight_unit = 'kg';
                                }
                            }
                            // Lấy title của sản phẩm class product-title product_title entry-title
                            const title_hedon = doc.querySelector('.product-title.product_title.entry-title');
                            if (title_hedon) {
                                const title = title_hedon.innerText.replace(/[\n\t]/g, '').trim();
                                result.title = title + result.title; // Thêm title vào kết quả
                            }
                            // Lấy giá tiền trong class woocommerce-Price-amount amount
                            const price_Element = doc.querySelector('.woocommerce-Price-amount.amount');
                            if (price_Element) {
                                let price = price_Element.innerText.replace(/[\n\t]/g, '').trim();
                                price = price.replace(/[₫.]/g, '').trim(); // Bỏ ký tự ₫ và dấu chấm
                                result.price = price;
                                // Nếu variants chưa có, khởi tạo mảng
                                if (!result.variants || !Array.isArray(result.variants)) {
                                    result.variants = [{}];
                                }
                                result.variants[0].price = price;
                                // "inventory_quantity": 1,
                                // "inventory_management": "shopify",
                                result.variants[0].inventory_quantity = 1;
                                result.variants[0].inventory_management = "shopify";
                            }
                            break;
                        case 'https://ruouchuan.vn/':
                            // Lấy text specs
                            const spec_div_ruou_chuan = doc.querySelector('.product-specs__list');
                            if (spec_div_ruou_chuan) {
                                const metaDivs = spec_div_ruou_chuan.querySelectorAll('.meta');
                                const allTexts = [];
                                metaDivs.forEach(metaDiv => {
                                    const spans = metaDiv.querySelectorAll('span');
                                    const texts = Array.from(spans).map(span =>
                                        span.innerText.replace(/[\n\t]/g, '').trim()
                                    );
                                    if (texts.length) {
                                        allTexts.push(texts.join('\n'));
                                    }
                                });
                                if (allTexts.length) {
                                    result.body_html = allTexts.join('\n');
                                    const weightInfo = this.extractVolume(result.body_html);
                                    if (weightInfo) {
                                        result.variants[0].grams = weightInfo.grams;
                                        result.variants[0].weight = weightInfo.weight;
                                        result.variants[0].weight_unit = 'kg';
                                    }
                                }
                            }
                            // Lấy title của sản phẩm class product-title product_title entry-title
                            let product_vendor_ruouchuan = doc.querySelector('.product__title h1');
                            console.log('product_vendor_ruouchuan:', product_vendor_ruouchuan);
                            if (product_vendor_ruouchuan) {
                                const title = product_vendor_ruouchuan.innerText.replace(/[\n\t]/g, '').trim();
                                result.title = title + result.title; // Thêm title vào kết quả
                            }
                            const price_ruouchuan = doc.querySelector('.product__info-wrapper .price__container .price__regular .price-item');
                            console.log('price_ruouchuan:', price_ruouchuan);
                            if (price_ruouchuan) {
                                let price = price_ruouchuan.innerText.replace(/[\n\t]/g, '').trim();
                                price = price.replace(/[₫.VND]/g, '').trim(); // Bỏ ký tự ₫ và dấu chấm
                                result.price = price;
                                // Nếu variants chưa có, khởi tạo mảng
                                if (!result.variants || !Array.isArray(result.variants)) {
                                    result.variants = [{}];
                                }
                                result.variants[0].price = price;
                                // "inventory_quantity": 1,
                                // "inventory_management": "shopify",
                                result.variants[0].inventory_quantity = 1;
                                result.variants[0].inventory_management = "shopify";
                            }
                            break;
                        default:
                            // Lấy text specs
                            const specsDiv = doc.querySelector('.product-specs__list');
                            if (specsDiv) {
                                const metaDivs = specsDiv.querySelectorAll('.meta');
                                const allTexts = [];
                                metaDivs.forEach(metaDiv => {
                                    const spans = metaDiv.querySelectorAll('span');
                                    const texts = Array.from(spans).map(span =>
                                        span.innerText.replace(/[\n\t]/g, '').trim()
                                    );
                                    if (texts.length) {
                                        allTexts.push(texts.join('\n'));
                                        // allTexts.push(texts);
                                    }
                                });
                                if (allTexts.length) {
                                    const cleaned = allTexts.map(item => item.replace('\n', ' '));
                                    result.body_html = cleaned.join('\n');
                                    const weightInfo = this.extractVolume(result.body_html);
                                    if (weightInfo) {
                                        result.variants[0].grams = weightInfo.grams;
                                        result.variants[0].weight = weightInfo.weight;
                                        result.variants[0].weight_unit = 'kg';
                                    }
                                    // result.detail = allTexts;
                                }
                            }
                            // Lấy title của sản phẩm class product-title product_title entry-title
                            const titleElement = doc.querySelector('.product-title.product_title.entry-title');
                            if (titleElement) {
                                const title = titleElement.innerText.replace(/[\n\t]/g, '').trim();
                                result.title = title + result.title; // Thêm title vào kết quả
                            }
                            // Lấy giá tiền trong class woocommerce-Price-amount amount
                            const priceElement = doc.querySelector('.woocommerce-Price-amount.amount');
                            if (priceElement) {
                                let price = priceElement.innerText.replace(/[\n\t]/g, '').trim();
                                price = price.replace(/[₫.]/g, '').trim(); // Bỏ ký tự ₫ và dấu chấm
                                result.price = price;
                                // Nếu variants chưa có, khởi tạo mảng
                                if (!result.variants || !Array.isArray(result.variants)) {
                                    result.variants = [{}];
                                }
                                result.variants[0].price = price;
                                // "inventory_quantity": 1,
                                // "inventory_management": "shopify",
                                result.variants[0].inventory_quantity = 1;
                                result.variants[0].inventory_management = "shopify";
                            }
                            break;
                    }


                    // Lấy ảnh trong class product-gallery large-5 col
                    const galleryDiv = doc.querySelectorAll('.woocommerce-product-gallery__image');
                    let imgLinks = [];
                    if (galleryDiv) {
                        // lấy link trong galleryDiv data-thumbnail
                        imgLinks = Array.from(galleryDiv)
                            .map(img => {
                                const imgElement = img.querySelector('a');
                                if (imgElement) {
                                    const src = imgElement.getAttribute('data-thumbnail') || imgElement.href;
                                    return src ? { src } : null;
                                }
                                return null;
                            })
                            .filter(obj => obj); // Lọc bỏ các object null
                        result.images = imgLinks; // Lưu ảnh vào kết quả
                    }



                    // lấy ghi chú trong class get-content
                    const noteElement = doc.querySelector('.get-content');
                    if (noteElement) {
                        const note = noteElement.innerText.replace(/[\n\t]/g, '').trim();
                        result.detail = note; // Thêm ghi chú
                    }

                    this.results.push(result);
                    this.imgLinks.push(...imgLinks);
                    console.log('Ảnh:', this.results);

                };
                reader.readAsText(file);
            });
        },
        async readHTML() {
            this.link_hrefs.forEach(async (link) => {
                let proxy = 'https://api.allorigins.win/get?url=' + encodeURIComponent(link);
                try {
                    const response = await fetch(proxy);
                    const data = await response.json();
                    const html = data.contents;

                    // Parse HTML và lấy text của class product-specs__list
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');

                    // Lấy text specs
                    const specsDiv = doc.querySelector('.product-specs__list');
                    let result = 'Không tìm thấy thông tin';
                    if (specsDiv) {
                        const metaDivs = specsDiv.querySelectorAll('.meta');
                        const allTexts = [];
                        metaDivs.forEach(metaDiv => {
                            const spans = metaDiv.querySelectorAll('span');
                            const texts = Array.from(spans).map(span =>
                                span.innerText.replace(/[\n\t]/g, '').trim()
                            );
                            if (texts.length) {
                                allTexts.push(texts.join(' | '));
                            }
                        });
                        if (allTexts.length) {
                            result = allTexts.join('\n');
                        }
                    }

                    // Lấy ảnh trong class product-gallery large-5 col
                    const galleryDiv = doc.querySelector('.product-gallery.large-5.col');
                    let imgLinks = [];
                    if (galleryDiv) {
                        const imgs = galleryDiv.querySelectorAll('a');
                        imgLinks = Array.from(imgs).map(img => img.href);
                    }



                    console.log('Ảnh:', imgLinks, result);
                    this.imgLinks.push(...imgLinks);
                    this.results.push(result);
                } catch (error) {
                    console.log(error);
                    alert('Lỗi khi lấy HTML: ' + error);
                }
            });
        },
        async handleClick() {

            let link = 'https://envang.vn/aberrlour-18yo-700ml/';
            let proxy = 'https://api.allorigins.win/get?url=' + encodeURIComponent(link);
            try {
                const response = await fetch(proxy);
                const data = await response.json();
                const html = data.contents;

                // Parse HTML và lấy text của class product-specs__list
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                // Lấy text specs như cũ
                const specsDiv = doc.querySelector('.product-specs__list');
                let result = 'Không tìm thấy thông tin';
                if (specsDiv) {
                    const metaDivs = specsDiv.querySelectorAll('.meta');
                    const allTexts = [];
                    metaDivs.forEach(metaDiv => {
                        const spans = metaDiv.querySelectorAll('span');
                        const texts = Array.from(spans).map(span =>
                            span.innerText.replace(/[\n\t]/g, '').trim()
                        );
                        if (texts.length) {
                            allTexts.push(texts.join(' | '));
                        }
                    });
                    if (allTexts.length) {
                        result = allTexts.join('\n');
                    }
                }

                // Lấy ảnh trong class product-gallery large-5 col
                const galleryDiv = doc.querySelector('.product-gallery.large-5.col');
                let imgLinks = [];
                if (galleryDiv) {
                    const imgs = galleryDiv.querySelectorAll('a');
                    imgLinks = Array.from(imgs).map(img => img.href);
                }
                console.log('Ảnh:', imgLinks, result);
                this.imgLinks = imgLinks;
                this.results = result;
                // Nếu vẫn muốn tải file HTML, giữ lại đoạn này
                // const blob = new Blob([html], { type: 'text/html' });
                // const url = URL.createObjectURL(blob);
                // const a = document.createElement('a');
                // a.href = url;
                // a.download = 'page.html';
                // document.body.appendChild(a);
                // a.click();
                // document.body.removeChild(a);
                // URL.revokeObjectURL(url);
            } catch (error) {
                alert('Lỗi khi lấy HTML: ' + error);
            }
        }
    },
}
</script>
<style scoped></style>
