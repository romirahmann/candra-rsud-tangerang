import moment from "moment";
import { useEffect, useState } from "react";
import { Table } from "../../shared/Table";

export function TableChecksheet({
  data = [],
  selectedData = [],
  filter = [],
  resetChecklist,
}) {
  const [selectedRows, setSelectedRows] = useState([]);
  useEffect(() => {
    selectedData(selectedRows);
  }, [selectedRows]);

  useEffect(() => {
    setSelectedRows([]);
  }, [resetChecklist]);

  const columns = [
    { header: "Kode Checklist", key: "Kode_Checklist" },
    { header: "No MR", key: "NoMR" },
    { header: "Nama Pasien", key: "NamaPasien" },
    {
      header: "Tanggal",
      key: "Tanggal",
      render: (val) => moment(val, "DDMMYYYY").format("DD-MM-YYYY"),
    },
    { header: "Kategori", key: "kategori" },
    { header: "Layanan", key: "layanan" },
    { header: "Periode Ranap", key: "Periode_Ranap" },
  ];
  return (
    <>
      <Table data={data} columns={columns} rowsPerPage={filter.perPage || 10} />
    </>
  );
}
