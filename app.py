# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from rembg import remove
# import requests
# import base64
from flask import Flask, request, jsonify
from flask_cors import CORS
from rembg import remove
import requests
import base64
from bs4 import BeautifulSoup
import urllib.parse
import re
from openai import OpenAI
import google.generativeai as genai


app = Flask(__name__)
CORS(app)

@app.route("/remove-bg", methods=["POST"])
def remove_bg():
    image_url = request.json.get("url")
    if not image_url:
        return {"error": "No image URL provided"}, 400

    max_retries = 5
    delay_seconds = 1  # thời gian chờ giữa các lần thử lại

    for attempt in range(1, max_retries + 1):
        try:
            # Tải ảnh
            resp = requests.get(image_url, timeout=10)
            resp.raise_for_status()

            # Xóa nền
            result = remove(resp.content)

            # Chuyển sang base64
            result_base64 = base64.b64encode(result).decode("utf-8")

            return jsonify({
                "image_base64": result_base64,
                "retries": attempt
            })

        except Exception as e:
            print(f"❌ Lỗi lần {attempt}: {e}")
            if attempt < max_retries:
                time.sleep(delay_seconds)  # Chờ trước khi thử lại
            else:
                return jsonify({
                    "error": str(e),
                    "retries": attempt
                }), 500


    
    # ========== API TÌM SẢN PHẨM ==========
genai.configure(api_key="AIzaSyDdeWRKjI7kOGbVt2w2cD9WGdecSC6XGjI")
model = genai.GenerativeModel("gemini-2.5-flash")
@app.route("/product-info", methods=["POST"])
def product_info():
    
    data = request.json
    products = data.get("products", [])  # Nhận mảng tên rượu

    results = []
    for wine_name in products:
        prompt = f"""
        Tôi có tên rượu: "{wine_name}".
        Tìm thông tin trả về theo đúng format sau, trên một dòng duy nhất:
        Xuất xứ: <giá trị> Thương hiệu: <giá trị> Nồng độ: <giá trị> Phân loại: <giá trị>
        Giống: <giá trị> Vùng: <giá trị> Hương vị: <giá trị> Thức ăn: <giá trị> Dung tích: <giá trị> Tuổi rượu: <giá trị>
        Nếu không biết thì để trống ("").
        Không trả lời thêm, không xuống dòng, không giải thích.
        """
        try:
            response = model.generate_content(prompt)
            results.append({
                "name": wine_name,
                "info": response.text.strip()
            })
        except Exception as e:
            results.append({
                "name": wine_name,
                "error": str(e)
            })

    return jsonify({"results": results})

if __name__ == "__main__":
    app.run(host="localhost", port=5000)
