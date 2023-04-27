import { GitHub } from "@mui/icons-material";
import { Avatar, Container, Typography } from "@mui/material";
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#181821] py-20">
      <Container component="section" className="text-white">
        <section className="flex flex-row justify-between">
          <section className="flex flex-col">
            <div className="flex flex-row items-center gap-2">
              <Avatar variant="rounded" className="!bg-sky-600">
                D
              </Avatar>
              <Typography variant="h6">Data Annotation App</Typography>
            </div>
            <p className="text-neutral-400 my-4">
              {/* Phone: <a href="tel:0986.744.529">0986.744.529</a>
              <br />
              Email:{" "}
              <a href="mailto:19120687@student.hcmus.edu.vn">
                19120687@student.hcmus.edu.vn
              </a>
              <br /> */}
            </p>
          </section>
          <section>
            <div>
              <Typography variant="h6">Members</Typography>
            </div>
            <p className="text-neutral-400 my-4">
              {[
                { name: "Lê Huỳnh Minh Tuấn", mssv: "19120148" },
                { name: "Ngô Quốc Toại", mssv: "19120687" },
                { name: "Phạm Minh Trí", mssv: "19120692" },
              ].map((student) => (
                <React.Fragment key={student.mssv}>
                  <a href={`mailto:${student.mssv}@student.hcmus.edu.vn`}>
                    {student.mssv} - {student.name}
                  </a>
                  <br />
                </React.Fragment>
              ))}
            </p>
          </section>
          <section>
            <div>
              <Typography variant="h6">Introductions</Typography>
            </div>
            <p className="text-neutral-400 my-4">
              Đồ án lý thuyết môn học 'Ứng dụng phân tán'
              <br />
              Cosplay Doccano
            </p>
          </section>
          <section>
            <div>
              <Typography variant="h6">Features</Typography>
            </div>
            <p className="text-neutral-400 my-4">
              <ul className="list-disc">
                <li>Management Project</li>
                <li></li>
                <li></li>
                <li></li>
              </ul>
            </p>
          </section>
        </section>
        <section className="flex flex-col gap-4">
          <section className="flex flex-row justify-between items-center">
            <p className="text-neutral-400">
              03/2023 - 06/2023 Data-Annotation-FE
            </p>
            <a href="https://github.com/toaingo2108/data-annotation-fe">
              <GitHub />
            </a>
          </section>
          <section className="flex flex-row justify-between items-center">
            <p className="text-neutral-400">
              03/2023 - 06/2023 Data-Annotation-BE
            </p>
            <a href="https://github.com/minhtri06/data-annotation-app">
              <GitHub />
            </a>
          </section>
        </section>
      </Container>
    </footer>
  );
}
