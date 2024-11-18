import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Modal from "./ModalForm";
import Header from "./Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BerandaPage = () => {
  const [desaList, setDesaList] = useState([]);
  const [filteredDesaList, setFilteredDesaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDesa, setSelectedDesa] = useState(null);
  const [search, setSearch] = useState({ kategori: "", nama_desa: "", alamat_desa: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const navigate = useNavigate();

  const fetchDesaData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/desa");
      setDesaList(response.data);
      setLoading(false);
    } catch (err) {
      setError("Gagal memuat data desa.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesaData();
  }, []);

  useEffect(() => {
    const filteredData = desaList.filter(
      (desa) =>
        (search.kategori ? desa.kategori.toLowerCase().includes(search.kategori.toLowerCase()) : true) &&
        (search.nama_desa ? desa.nama_desa.toLowerCase().includes(search.nama_desa.toLowerCase()) : true) &&
        (search.alamat_desa ? desa.alamat_desa.toLowerCase().includes(search.alamat_desa.toLowerCase()) : true)
    );
    setFilteredDesaList(filteredData);
  }, [search, desaList]);

  const handleModalClose = (isSuccess) => {
    setIsModalOpen(false);
    setSelectedDesa(null);
    fetchDesaData();
  };

  const handleEdit = (desa) => {
    setSelectedDesa(desa);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setSelectedDesa(desaList.find((desa) => desa.id === id));
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/desa/${selectedDesa.id}`);
      toast.success("Data desa berhasil dihapus!");
      fetchDesaData();
      setIsDeleteModalOpen(false);
    } catch (err) {
      toast.error("Gagal menghapus data desa.");
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearch({ ...search, [name]: value });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  const getUserRole = () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        return decoded.role;
      } catch (error) {
        console.error("Token tidak valid:", error);
        return null;
      }
    }
    return null;
  };

  const userRole = getUserRole();
  const showAddButton = userRole === "admin";

  if (loading) {
    return <div className="text-center text-xl text-gray-600">Memuat data...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-500">{error}</div>;
  }

  const calculateCategoryPercentage = (category) => {
    const total = desaList.length;
    if (total === 0) return 0;
    const count = desaList.filter((desa) => desa.kategori === category).length;
    return ((count / total) * 100).toFixed(0);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDesaList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDesaList.length / itemsPerPage);

  return (
    <div className="p-5">
      <Header onLogout={handleLogout} />

      {/* Card Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-blue-100 text-blue-800 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold">Kategori Maju</h3>
          <p className="text-2xl font-bold">{calculateCategoryPercentage("Maju")}%</p>
        </div>
        <div className="p-4 bg-green-100 text-green-800 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold">Kategori Tumbuh</h3>
          <p className="text-2xl font-bold">{calculateCategoryPercentage("Tumbuh")}%</p>
        </div>
        <div className="p-4 bg-yellow-100 text-yellow-800 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold">Kategori Berkembang</h3>
          <p className="text-2xl font-bold">{calculateCategoryPercentage("Berkembang")}%</p>
        </div>
      </div>

      {/* search and pagination section */}
      <div className="mb-5 flex justify-between items-center">
        <div className="flex gap-4">
          <input type="text" name="nama_desa" value={search.nama_desa} onChange={handleSearchChange} placeholder="Cari Nama Desa" className="p-2 border border-gray-300 rounded-lg" />
          <input type="text" name="alamat_desa" value={search.alamat_desa} onChange={handleSearchChange} placeholder="Cari Alamat Desa" className="p-2 border border-gray-300 rounded-lg" />
          <select name="kategori" value={search.kategori} onChange={handleSearchChange} className="p-2 border border-gray-300 rounded-lg">
            <option value="">Pilih Kategori</option>
            <option value="Maju">Maju</option>
            <option value="Tumbuh">Tumbuh</option>
            <option value="Berkembang">Berkembang</option>
          </select>
        </div>

        {showAddButton && (
          <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none transition-all duration-300 ease-in-out">
            + Tambah Data
          </button>
        )}
      </div>

      {desaList.length === 0 ? (
        <p className="text-center text-lg text-gray-500">Tidak ada data desa.</p>
      ) : (
        <div className="overflow-x-auto mt-5">
          <table className="min-w-full border-collapse border border-gray-300 shadow-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-center">No</th>
                <th className="px-4 py-2 text-center">Nama Desa</th>
                <th className="px-4 py-2 text-center">Alamat</th>
                <th className="px-4 py-2 text-center">Tahun Pembentukan</th>
                <th className="px-4 py-2 text-center">Jumlah Hibah</th>
                <th className="px-4 py-2 text-center">Dana Sekarang</th>
                <th className="px-4 py-2 text-center">Anggota Awal</th>
                <th className="px-4 py-2 text-center">Anggota Sekarang</th>
                <th className="px-4 py-2 text-center">Kategori</th>
                {showAddButton && <th className="px-4 py-2 text-center">Aksi</th>}
              </tr>
            </thead>
            <tbody className="text-center">
              {currentItems.map((desa, index) => (
                <tr key={desa.id} className="border-b border-gray-200">
                  <td className="px-4 py-2">{indexOfFirstItem + index + 1}</td>
                  <td className="px-4 py-2">{desa.nama_desa}</td>
                  <td className="px-4 py-2">{desa.alamat_desa}</td>
                  <td className="px-4 py-2">{desa.tahun_pembentukan}</td>
                  <td className="px-4 py-2">{formatCurrency(desa.jumlah_hibah_diterima)}</td>
                  <td className="px-4 py-2">{formatCurrency(desa.jumlah_dana_sekarang)}</td>
                  <td className="px-4 py-2">{desa.jumlah_anggota_awal}</td>
                  <td className="px-4 py-2">{desa.jumlah_anggota_sekarang}</td>
                  <td className="px-4 py-2">{desa.kategori}</td>
                  {showAddButton && (
                    <td className="px-4 py-2">
                      <button onClick={() => handleEdit(desa)} className="bg-yellow-500 text-white py-1 px-3 rounded-md mr-2 hover:bg-yellow-600 focus:outline-none">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(desa.id)} className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 focus:outline-none">
                        Hapus
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center mt-4">
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 border border-gray-300 rounded-l-md bg-gray-200 hover:bg-gray-300">
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button key={index} onClick={() => paginate(index + 1)} className={`px-4 py-2 border-t border-b border-gray-300 ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-white"}`}>
                {index + 1}
              </button>
            ))}
            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 border border-gray-300 rounded-r-md bg-gray-200 hover:bg-gray-300">
              Next
            </button>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Konfirmasi Hapus</h3>
            <p className="text-sm text-gray-600">Apakah Anda yakin ingin menghapus desa ini?</p>
            <div className="mt-4">
              <button onClick={confirmDelete} className="bg-red-500 text-white py-2 px-4 rounded-md mr-2 hover:bg-red-600 focus:outline-none">
                Hapus
              </button>
              <button onClick={cancelDelete} className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none">
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && <Modal onClose={handleModalClose} selectedDesa={selectedDesa} />}

      <ToastContainer />
    </div>
  );
};

export default BerandaPage;
