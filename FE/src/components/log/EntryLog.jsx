/* eslint-disable no-unused-vars */
import { GoLog } from "react-icons/go";
import { TableLogEntry } from "./TableLogEntry";
import { useEffect, useState } from "react";
import api from "../../services/axios.service";

export function EntryLog() {
  const [logs, setLog] = useState([]);
  useEffect(() => {
    const fetchLog = async () => {
      let res = await api.get("/master/entry-log");
      setLog(res.data.data);
    };
    fetchLog();
  }, []);
  return (
    <>
      <div className="max-w-full p-5 bg-white">
        <div className="flex items-center font-bold gap-2 uppercase text-2xl">
          <GoLog />
          Entry Log
        </div>
        <div className="tableLog">
          <TableLogEntry data={logs} />
        </div>
      </div>
    </>
  );
}
