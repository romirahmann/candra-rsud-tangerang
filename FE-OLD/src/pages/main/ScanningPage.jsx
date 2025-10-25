/* eslint-disable no-unused-vars */
import { MdDocumentScanner } from "react-icons/md";
import { Titlepage } from "../../shared/Titlepage";
import { FormScan } from "../../components/scanning/FormScan";
import { useEffect, useState } from "react";
import { TableScan } from "../../components/scanning/TableScan";
import api from "../../services/axios.service";
import { AlertMessage } from "../../shared/AlertMessage";
import { LoadingScreen } from "../../shared/LoadingScreen";

export function ScanningPage() {
  const [dataCandra, setDataCandra] = useState([]);
  const [filterProses, setFilterProses] = useState(
    sessionStorage.getItem("idproses") || "ALL"
  );
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "warning",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDataScanning();
    // console.log(filterProses);
  }, [filterProses]);

  const fetchDataScanning = async () => {
    try {
      const res = await api.get(`/master/candra-now`);
      let data = res.data.data;

      setDataCandra(
        filterProses === "ALL"
          ? data
          : data.filter((item) => item.idproses === filterProses)
      );
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const { name, value } = e.target;
  };

  const handleAdd = (val) => {
    fetchDataScanning();
    setAlert({
      show: true,
      message: val,
      type: "success",
    });
  };

  const handleSelectedProses = (value) => {
    sessionStorage.setItem("idproses", value);
    setFilterProses(value);
  };

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <>
          <div className="max-w-full">
            <Titlepage
              title={`Scanning Proses`}
              icon={MdDocumentScanner}
              onSearch={handleSearch}
            />
            <div className=" px-2 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 col-1 border rounded-lg shadow-md bg-gray-50">
                <FormScan
                  onAdd={handleAdd}
                  onLoadingChange={(val) => setLoading(val)}
                />
              </div>
              <div className="col-span-3 border rounded-lg shadow-md overflow-auto p-5 bg-gray-50">
                <TableScan
                  data={dataCandra}
                  selectedProses={handleSelectedProses}
                  onAlert={(val) => {
                    setAlert({ show: true, message: val, type: "success" });
                    fetchDataScanning();
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}
      <div>
        {alert.show && (
          <AlertMessage
            type={alert.type}
            message={alert.message}
            onClose={() =>
              setAlert({
                show: false,
                type: "",
                message: "",
              })
            }
          />
        )}
      </div>
    </>
  );
}
