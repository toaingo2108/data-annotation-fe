import React, { useEffect, useRef, useState } from "react";
import projectTypeClient from "../clients/projectTypeClient";
import { useStateContext } from "../context/ContextProvider";
import { enqueueSnackbar } from "notistack";
import { Avatar, Chip, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";

export default function ProjectTypes() {
  const [projectTypes, setProjectTypes] = useState([]);
  const { setLoading } = useStateContext();
  const newTypeRef = useRef();
  const [loadingCreate, setLoadingCreate] = useState(false);

  useEffect(() => {
    collectData();
  }, []);

  const collectData = () => {
    setLoading(true);
    projectTypeClient
      .getAll()
      .then(({ data }) => {
        setProjectTypes(data.projectTypes);
      })
      .catch((err) => {
        enqueueSnackbar({
          message: err.response.data.error || err.response.data.message,
          variant: "error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: newTypeRef.current.value,
    };
    setLoadingCreate(true);
    projectTypeClient
      .create(payload)
      .then((data) => {
        enqueueSnackbar({
          message: "Created Project Type Successfully!",
          variant: "success",
        });
      })
      .catch((err) => {
        enqueueSnackbar({
          message: err.response.data.error || err.response.data.message,
          variant: "error",
        });
      })
      .finally(() => {
        setLoadingCreate(false);
        collectData();
        newTypeRef.current.value = "";
      });
  };

  const handleDelete = (id) => {
    projectTypeClient
      .delete(id)
      .then((data) => {
        enqueueSnackbar({
          message: "Delete Project Type Successfully!",
          variant: "success",
        });
      })
      .catch((err) => {
        enqueueSnackbar({
          message: err.response.data.error || err.response.data.message,
          variant: "error",
        });
      })
      .finally(() => {
        collectData();
      });
  };

  return (
    <div className="grid grid-cols-2">
      <div className="flex flex-col justify-start gap-2">
        {projectTypes.map((type) => (
          <div key={type.id}>
            <Chip
              label={type.name}
              avatar={<Avatar>{type.id}</Avatar>}
              onDelete={() => handleDelete(type.id)}
            />
          </div>
        ))}
      </div>
      <div>
        <form onSubmit={onSubmit} className="flex flex-col gap-2">
          <TextField inputRef={newTypeRef} label="New Type" />
          <LoadingButton
            loading={loadingCreate}
            type="submit"
            size="small"
            variant="contained"
          >
            Create
          </LoadingButton>
        </form>
      </div>
    </div>
  );
}
