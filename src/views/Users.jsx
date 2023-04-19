import { useEffect, useState } from "react";
import userClient from "../clients/userClient";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Chip, LinearProgress, Typography } from "@mui/material";
import CustomNoRows from "../components/CustomNoRows";
import { rolesCode, rolesUser } from "../utils/roles";
import moment from "moment/moment";
import { useStateContext } from "../context/ContextProvider";
import NotFound from "./NotFound";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const { user, setLoading } = useStateContext();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    userClient
      .getAllUser()
      .then(({ data: { data } }) => {
        setUsers(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const columnsUsers = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "role",
      headerName: "Role",
      width: 160,
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

  if (user.role?.toUpperCase() !== rolesCode.MANAGER) {
    return <NotFound />;
  }

  return (
    <div>
      <div className="flex flex-row items-baseline justify-between">
        <Typography variant="h3">Users</Typography>
        <Button
          variant="contained"
          size="small"
          className="!mb-4"
          startIcon={<Add />}
          onClick={() => navigate("/users/new")}
        >
          Create user
        </Button>
      </div>
      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          components={{
            NoRowsOverlay: CustomNoRows,
            NoResultsOverlay: CustomNoRows,
          }}
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
    </div>
  );
}
