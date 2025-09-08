const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');
const PORT = 3001;
app.use(cors());
const multer = require('multer');
const upload = multer();
// ✅ Tăng giới hạn body để xử lý ảnh lớn hoặc nhiều ảnh
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
const uploadProductsWithCloudImages = require('./uploadProductsWithCloudImages');

let shop_name = 'syx10i-mq.myshopify.com';
let access_token = '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';


app.post('/shopify/upload-images', async (req, res) => {
  const products = req.body;

  if (!Array.isArray(products)) {
    return res.status(400).json({ error: 'Invalid format: expected array of products' });
  }

  try {
    const uploaded = await uploadProductsWithCloudImages(products);
    res.json(uploaded);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to upload images' });
  }
});
app.get('/shopify/products', async (req, res) => {
  try {
    const { product_type } = req.query; // lấy product_type từ query string

    let products = [];
    let url = `https://${shop_name}/admin/api/2025-07/products.json?limit=250`;
    if (product_type) {
      // Nếu có lọc loại sản phẩm
      url += `&product_type=${encodeURIComponent(product_type)}`;
    }

    let hasNext = true;

    while (hasNext) {
      const response = await axios.get(url, {
        headers: {
          'X-Shopify-Access-Token': access_token,
          'Content-Type': 'application/json',
        }
      });

      products = products.concat(response.data.products);

      // Xem trong header có link next không
      const linkHeader = response.headers.link;
      if (linkHeader && linkHeader.includes('rel="next"')) {
        const match = linkHeader.match(/<([^>]+)>; rel="next"/);
        if (match && match[1]) {
          url = match[1];
        } else {
          hasNext = false;
        }
      } else {
        hasNext = false;
      }
    }

    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/shopify/products', async (req, res) => {
  try {
    const response = await axios.post(
      `https://${shop_name}/admin/api/2025-07/products.json`,
      req.body, // dữ liệu sản phẩm gửi từ client
      {
        headers: {
          'X-Shopify-Access-Token': access_token,
          'Content-Type': 'application/json',
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Route lấy danh sách categories qua GraphQL
app.get('/shopify/categories', async (req, res) => {
  const query = `
  {
    productCategories(first: 50) {
      edges {
        node {
          id
          name
          handle
        }
      }
    }
  }`;

  try {
    const response = await axios.post(
      `https://${shop_name}/admin/api/2025-07/graphql.json`,
      { query },
      {
        headers: {
          'X-Shopify-Access-Token': access_token,
          'Content-Type': 'application/json',
        }
      }
    );

    // Trả về mảng danh mục
    // const categories = response.data.data.productCategories.edges.map(edge => edge.node);
    const categories = response.data.data
    console.log('Categories:', response);
    res.json(categories);

  } catch (error) {
    console.error('Error fetching categories:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      message: 'Failed to fetch product categories (GraphQL)',
      error: error.response?.data || error.message,
    });
  }
});
app.get('/shopify/products-by-id', async (req, res) => {
  const ids = req.query.ids; // ví dụ: "9983507005721,123456789"

  try {
    const response = await axios.get(
      `https://${shop_name}/admin/api/2025-07/products.json?ids=${ids}`,
      {
        headers: {
          'X-Shopify-Access-Token': access_token
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching products by IDs:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

app.get('/proxy-image', async (req, res) => {
  const imageUrl = req.query.url;
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    res.set('Content-Type', 'image/*');
    res.set('Access-Control-Allow-Origin', '*'); // Cho phép tất cả domain
    res.send(response.data);
  } catch (err) {
    res.status(500).send('Error fetching image');
  }
});


// app.post('/remove-bg', upload.single('image'), async (req, res) => {
//   try {
//     console.log('Received file:', req.file.originalname);
//     const formData = new FormData();
//     formData.append('image', req.file.buffer, { filename: req.file.originalname });

//     const flaskResponse = await axios.post(
//       'http://localhost:5000/remove-bg',
//       formData,
//       { headers: formData.getHeaders(), responseType: 'arraybuffer' }
//     );

//     res.set('Content-Type', flaskResponse.headers['content-type']);
//     res.send(flaskResponse.data);
//   } catch (error) {
//     console.error('Error calling Flask remove-bg:', error.message);
//     res.status(500).send('Failed to remove background');
//   }
// });

app.post('/remove-bg', upload.single('image'), async (req, res) => {
  // Xử lý ảnh ở đây, ví dụ gọi API remove.bg hoặc trả về ảnh đã xử lý
  // res.send(processedImageBuffer);
  console.log('Received file:');
  res.status(501).send('Chưa triển khai xử lý xóa nền!');
});


app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));