import { useEffect, useState } from "react";
import userClient from "../clients/userClient";
import { DataGrid } from "@mui/x-data-grid";
import { Chip, LinearProgress } from "@mui/material";
import CustomNoRows from "../components/CustomNoRows";
import { rolesUser } from "../utils/roles";
import moment from "moment/moment";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loadingTable, setLoadingTable] = useState(false);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    setLoadingTable(true);
    userClient
      .getAllUser()
      .then(({ data: { data } }) => {
        setUsers(data);
      })
      .finally(() => {
        setLoadingTable(false);
      });
  }, []);

  const columnsUsers = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "role",
      headerName: "Role",
      width: 200,
      renderCell: ({ row }) => {
        const roleUser = rolesUser?.find(
          (role) => role.name === row.role.toUpperCase()
        );
        return (
          <Chip
            color={roleUser?.colorChip}
            label={`${roleUser?.name || "Đang cập nhật"}`}
          />
        );
      },
    },

    { field: "name", headerName: "Name", width: 230, editable: true },
    { field: "email", headerName: "Email", width: 300 },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 200,
      renderCell: ({ row }) => {
        return moment(row.createdAt).local().format("MMMM Do YYYY, h:mm:ss a");
      },
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      width: 150,
      renderCell: ({ row }) => {
        return moment(row.updatedAt, "YYYYMMDD").local().fromNow();
      },
    },

    // {
    //   field: "action",
    //   headerName: "Thao tác",
    //   width: 100,
    //   sortable: false,
    //   filterable: false,
    //   renderCell: ({ row }) => {
    //     return (
    //       <div>
    //         <IconButton onClick={() => handleUpdateTrainee(row)}>
    //           <EditRounded />
    //         </IconButton>
    //       </div>
    //     );
    //   },
    // },
  ];

  return (
    <div style={{ height: 500, width: "100%" }}>
      <DataGrid
        components={{
          NoRowsOverlay: CustomNoRows,
          NoResultsOverlay: CustomNoRows,
          LoadingOverlay: LinearProgress,
        }}
        loading={loadingTable}
        rows={users}
        columns={columnsUsers}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        pageSize={pageSize}
        pagination
        rowsPerPageOptions={[5, 10, 20]}
        disableRowSelectionOnClick
        editMode="row"
        // onRowClick={(row) => navigate(`/trainee/detail/${row.id}`)}
      />
    </div>
  );
}
