import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import projectClient from "../../clients/projectClient";
import { useStateContext } from "../../context/ContextProvider";

export default function ProjectDetail() {
  const { id } = useParams();
  const { setLoading } = useStateContext();

  useEffect(() => {
    setLoading(true);
    projectClient
      .getProjectById(id)
      .then(({ data }) => {
        console.log(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return <div>ProjectDetail</div>;
}
