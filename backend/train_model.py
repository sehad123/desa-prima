import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib

# Load dataset dengan header di baris ke-3
data = pd.read_excel(r"D:\STIS Semester 7\skripsi\web\desa_prima\backend\dataset.xlsx", header=2)

# Debug: Tampilkan nama kolom
print("Nama kolom asli di dataset:")
print(data.columns)

# Rename kolom untuk menyesuaikan dengan kode
data.rename(columns={
    'TAHUN PEMBENTUKAN': 'Tahun Pembentukan',
    'JUMLAH HIBAH DITERIMA': 'Jumlah Hibah Diterima',
    'JUMLAH DANA SEKARANG': 'Jumlah Dana Sekarang',
    'JUMLAH ANGGOTA AWAL': 'Jumlah Anggota Awal',
    'JUMLAH ANGGOTA SEKARANG': 'Jumlah Anggota Sekarang',
    'KATEGORI 2022': 'Kategori 2022'
}, inplace=True)

# Debug: Tampilkan nama kolom setelah rename
print("Nama kolom setelah rename:")
print(data.columns)

# Membersihkan data: konversi nilai ke float
def convert_to_numeric(value):
    if isinstance(value, str):
        value = ''.join(filter(str.isdigit, value))
    try:
        return float(value)
    except ValueError:
        return 0

numeric_columns = ['Tahun Pembentukan', 'Jumlah Hibah Diterima', 
                   'Jumlah Dana Sekarang', 'Jumlah Anggota Awal', 
                   'Jumlah Anggota Sekarang']

for col in numeric_columns:
    data[col] = data[col].apply(convert_to_numeric)

# Ganti NaN dengan nilai rata-rata untuk kolom numerik
for col in numeric_columns:
    data[col].fillna(data[col].mean(), inplace=True)

# Debug: Tampilkan deskripsi statistik data
print("\nDeskripsi statistik data:")
print(data.describe())

# Cek apakah kolom yang diperlukan ada di dataset
required_columns = numeric_columns + ['Kategori 2022']
missing_columns = [col for col in required_columns if col not in data.columns]
if missing_columns:
    print(f"Kolom berikut tidak ditemukan dalam dataset: {missing_columns}")
    exit()

# Hapus baris dengan nilai kosong di kolom fitur atau target
data.dropna(subset=required_columns, inplace=True)

# Fitur dan target
X = data[numeric_columns]
y = data['Kategori 2022']

# Ubah target ke format kategori numerik
y = y.astype('category').cat.codes

# Bagi data menjadi latih dan uji
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Latih model
model = RandomForestClassifier(random_state=42)
model.fit(X_train, y_train)

# Simpan model
joblib.dump(model, 'desa_model.pkl')
print("Model berhasil disimpan!")

# Debug: Tampilkan informasi model setelah pelatihan
print("Informasi model setelah pelatihan:")
print(model)

# Load model dari file .pkl
loaded_model = joblib.load('desa_model.pkl')

# Debug: Tampilkan informasi tentang model
print("\nModel yang dimuat:")
print(loaded_model)

# Tampilkan parameter model
print("\nParameter model:")
print(loaded_model.get_params())

# Contoh prediksi dengan data baru
data_baru = pd.DataFrame([[2015, 20000000, 15000000, 20, 30]], columns=numeric_columns)
prediksi = loaded_model.predict(data_baru)

print("\nHasil prediksi untuk data baru:")
print(prediksi)
