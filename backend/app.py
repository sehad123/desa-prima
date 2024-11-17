from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS  # Tambahkan CORS untuk menghindari masalah saat akses dari frontend
import pandas as pd

app = Flask(__name__)
CORS(app)  # Izinkan semua origin, bisa disesuaikan untuk lebih ketat

# Load model
try:
    model = joblib.load('desa_model.pkl')
    print("Nama fitur saat pelatihan:", model.feature_names_in_)
except FileNotFoundError:
    print("Error: File 'desa_model.pkl' tidak ditemukan. Pastikan file model ada di direktori yang benar.")
    exit()

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Terima data dari request
        data = request.get_json()
        
        # Validasi apakah data lengkap
        required_keys = [
            'tahun_pembentukan',
            'jumlah_hibah_diterima',
            'jumlah_dana_sekarang',
            'jumlah_anggota_awal',
            'jumlah_anggota_sekarang'
        ]
        for key in required_keys:
            if key not in data:
                return jsonify({'error': f"Field '{key}' tidak ditemukan"}), 400

        # Map data ke format nama kolom yang digunakan saat pelatihan model
        features = pd.DataFrame([{
            'Tahun Pembentukan': data['tahun_pembentukan'],
            'Jumlah Hibah Diterima': data['jumlah_hibah_diterima'],
            'Jumlah Dana Sekarang': data['jumlah_dana_sekarang'],
            'Jumlah Anggota Awal': data['jumlah_anggota_awal'],
            'Jumlah Anggota Sekarang': data['jumlah_anggota_sekarang']
        }])
        
        # Log data untuk prediksi
        print("Data untuk prediksi:", features)

        # Prediksi
        prediction = model.predict(features)
        print("Hasil prediksi:", prediction)

        # Return hasil prediksi (pastikan tipe data kompatibel dengan JSON)
        return jsonify({'kategori': int(prediction[0])})
    
    except Exception as e:
        print("Error:", str(e))
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
