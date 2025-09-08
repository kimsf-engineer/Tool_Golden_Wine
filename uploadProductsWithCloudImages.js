const cloudinary = require('./cloudinary-setup');

const products = require('./products.json'); // hoặc dán mảng bạn vào đây trực tiếp

async function uploadImage(url) {
  try {
    const result = await cloudinary.uploader.upload(url, {
      folder: 'shopify-whisky'
    });
    return result.secure_url;
  } catch (err) {
    console.error(`❌ Upload failed for ${url}:`, err.message);
    return null;
  }
}

async function uploadProductsWithCloudImages(products) {
  const processed = []; 
  for (const product of products) {
    const newProduct = { ...product };
    newProduct.images = [];

    for (const imgUrl of product.images) {
      const uploadedUrl = await uploadImage(imgUrl.src);
      if (uploadedUrl) {
        newProduct.images.push({
            src: uploadedUrl
        });
      }
    }

    processed.push(newProduct);
  }

  return processed;
}

module.exports = uploadProductsWithCloudImages;

// processProducts(products).then((result) => {
//   console.log('✅ Processed products with new image URLs:\n');
//   console.log(JSON.stringify(result, null, 2));
// });
