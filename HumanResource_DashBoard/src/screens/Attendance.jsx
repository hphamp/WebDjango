import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  AiOutlineCheck,
  AiOutlineOrderedList,
  AiOutlinePicLeft,
  AiOutlineSearch,
} from "react-icons/ai";

import { textVariant, zoomIn } from "../utils/motion";
import { CheckIn, fetchAttandance } from "../actions/employeeActions";
import { HOST_API } from "../constants/Api";
import { Button, Loader } from "../components";
const Attendance = () => {
  const dispatch = useDispatch();
  const today = new Date().toISOString().substr(0, 10);

  const [date, setDate] = useState(today);
  const [isListView, setIsListView] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const employeeReducer = useSelector((state) => state.employeeReducer);
  const { attendance, employeeInfo, loading } = employeeReducer;
  const [isCheckIn, setIsCheckIn] = useState(false);
  const [attendanceData, setAttendanceData] = useState(attendance);

  console.log(attendance);
  useEffect(() => {
    const year = date.split("-")[0];
    const month = date.split("-")[1];
    const day = date.split("-")[2];
    const dateParams = { day, month, year };
    dispatch(fetchAttandance(dateParams));
  }, [date, dispatch, isCheckIn]);

  useEffect(() => {
    setAttendanceData(attendance);
    if (!attendance) setIsCheckIn(false);
    else {
      for (let att of attendance) {
        if (att.employee_code === employeeInfo?.employee_code) {
          if (att.time_in) {
            setIsCheckIn(true);
          }
        }
      }
    }
  }, [attendance, employeeInfo?.employee_code]);

  useEffect(() => {
    if (searchTerm !== "") {
      const filterData = attendance.filter((att) => {
        return (
          att.first_name.includes(searchTerm) ||
          att.last_name.includes(searchTerm)
        );
      });
      setAttendanceData(filterData);
    } else {
      setAttendanceData(attendance);
    }
  }, [searchTerm]);

  const handleChangeDate = (e) => {
    setDate(e.target.value);
  };

  const handleCheckIn = () => {
    dispatch(CheckIn(employeeInfo.employee_code));
  };
  if (loading) {
    return <Loader />;
  } else {
    return (
      <div className="container mx-auto px-4 sm:px-8 border border-slate-200 rounded-xl">
        <div className="py-8">
          <div className="flex flex-row items-center justify-between">
            <motion.h2
              variants={textVariant(0.5)}
              initial="hidden"
              animate="show"
              className="text-2xl font-semibold leading-tight"
            >
              Chấm công
            </motion.h2>
            {employeeInfo && (
              <Button
                primary
                onClick={handleCheckIn}
                rightIcon={isCheckIn ? <AiOutlineCheck /> : null}
                disabled={isCheckIn}
              >
                Điểm danh
              </Button>
            )}
          </div>
          <div className="my-2 flex sm:flex-row flex-col">
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                type: "spring",
                duration: 1,
                bounce: 0.1,
              }}
              className="flex flex-row mb-1 sm:mb-0 sm:flex-row border border-slate-500 rounded-md overflow-hidden"
            >
              <div className="flex items-center justify-center border ">
                <input
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="p-2 bg-white text-lg outline-none"
                />
                <span className="text-2xl p-2">
                  <AiOutlineSearch />
                </span>
              </div>
              <div className="p-2 block items-center bg-white">
                <input
                  className="outline-none text-base font-light from-neutral-400 "
                  placeholder="halo"
                  type="date"
                  value={date}
                  onChange={(e) => handleChangeDate(e)}
                />
              </div>
            </motion.div>
            <motion.div
              variants={zoomIn(0.5, 0.3)}
              initial="hidden"
              animate="show"
              className="flex items-center justify-center p-2 bg-slate-200 ml-auto rounded-md"
            >
              <button
                className={`p-1 ${isListView && "bg-white"} rounded-sm`}
                onClick={() => {
                  setIsListView(true);
                }}
              >
                <span className="text-xl font-semibold">
                  <AiOutlineOrderedList />
                </span>
              </button>
              <button
                className={`p-1 rounded-sm ${!isListView && "bg-white"}`}
                onClick={() => {
                  setIsListView(false);
                }}
              >
                <span className="text-xl font-semibold">
                  <AiOutlinePicLeft />
                </span>
              </button>
            </motion.div>
          </div>
          {attendanceData?.length > 0 ? (
            <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
              {isListView ? (
                <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                  <table className="min-w-full leading-normal">
                    <thead>
                      <tr>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Tên
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Vị trí
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Created at
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Tình trạng
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceData.map((employee, i) => (
                        <motion.tr
                          variants={zoomIn(i * 0.03, 0.5)}
                          initial="hidden"
                          whileInView="show"
                          whileHover="whileHover"
                          key={i}
                        >
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <a
                              className="flex items-center"
                              href={`/employees/${employee.employee_code}`}
                            >
                              <div className="flex-shrink-0 w-10 h-10">
                                <img
                                  className="w-full h-full rounded-full"
                                  src={HOST_API.concat(employee.img)}
                                  alt=""
                                />
                              </div>
                              <div className="ml-3">
                                <p className="text-gray-900 whitespace-no-wrap">
                                  {employee.first_name}
                                </p>
                              </div>
                            </a>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">
                              {employee.position}
                            </p>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">
                              Jan 21, 2020
                            </p>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                              <span
                                aria-hidden
                                className={`absolute inset-0 ${
                                  employee.time_in
                                    ? "bg-green-300"
                                    : "bg-red-300"
                                } opacity-50 rounded-full`}
                              ></span>
                              <span className="relative">
                                {employee.time_in
                                  ? `Check in at ${employee.time_in.slice(
                                      0,
                                      5
                                    )}`
                                  : "Absent"}
                              </span>
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="container bg-white border rounded-md py-5 px-1">
                  <div className="grid grid-cols-4 gap-4">
                    {attendanceData.map((employee, i) => (
                      <motion.a
                        href={`/employees/${employee.employee_code}`}
                        key={i}
                        variants={zoomIn(i * 0.05, 0.5)}
                        initial="hidden"
                        whileInView="show"
                        whileHover="whileHover"
                        className={`flex flex-col items-center ${
                          employee.time_in ? "bg-green-200" : "bg-red-200"
                        } shadow-lg rounded-lg overflow-hidden`}
                      >
                        <img
                          src={HOST_API.concat(employee.img)}
                          className="w-32 h-32 object-cover rounded-full mt-5"
                        />
                        <div className="p-4">
                          <h2 className="text-lg font-semibold text-slate-800 text-center ">
                            {employee.last_name} {employee.first_name}
                          </h2>
                          <p className="text-slate-800 text-center my-2">
                            {employee.position}
                          </p>
                          <p className="text-slate-800 text-center">
                            {employee.time_in
                              ? `Check in at ${employee.time_in.slice(0, 5)}`
                              : "Absent"}
                          </p>
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <h3>Chưa có dữ liệu</h3>
          )}
        </div>
      </div>
    );
  }
};

export default Attendance;
