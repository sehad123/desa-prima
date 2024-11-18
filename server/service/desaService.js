const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllDesa = async () => {
  return await prisma.desa.findMany();
};

const getDesaById = async (id) => {
  return await prisma.desa.findUnique({
    where: { id: parseInt(id) },
  });
};

const createDesa = async (data) => {
  const newDesa = await prisma.desa.create({
    data,
  });
  return newDesa;
};

const updateDesa = async (id, data) => {
  return await prisma.desa.update({
    where: { id: parseInt(id) },
    data,
  });
};

const deleteDesa = async (id) => {
  return await prisma.desa.delete({
    where: { id: parseInt(id) },
  });
};

module.exports = { getAllDesa, getDesaById, createDesa, updateDesa, deleteDesa };
