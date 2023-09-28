import React, { useEffect, useState } from "react";
import axios from "axios";
import AddStudent from "../components/AddStudent";
import StudentDetails from "./StudentDetails";
import Swal from "sweetalert2";
import {
  AiFillPlusCircle,
  AiOutlineDownload,
  AiOutlineEdit,
} from "react-icons/ai";
import { BsFillTrashFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const StudentList = ({ token, grades, sections }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [grade, setGrade] = useState(grades);
  const [section, setSection] = useState(sections);
  const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      // Check if grade and section are set before making the request
      if (grade !== "" && section !== "") {
        // console.log(
        //   "Fetching students for grade",
        //   grade,
        //   "and section",
        //   section
        // );
        const response = await axios.get(
          `https://lnhs-api.vercel.app/api/student/${grade}/${section}/students`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // console.log("API Response:", response.data);

        if (response.status === 200) {
          setStudents(response.data);
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Fetch students error:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [token, grade, section]);

  const viewAttendanceRecord = (studentId) => {
    // Redirect to the attendance record page with the studentId using navigate
    navigate(`/student-record/${studentId}`);
  };

  const toggleAddStudentModal = () => {
    setIsAddStudentModalOpen(!isAddStudentModalOpen);
  };

  // const handleEditInputChange = (e, field) => {
  //   const { value } = e.target;
  //   setEditingStudent((prevStudent) => ({
  //     ...prevStudent,
  //     [field]: value,
  //   }));
  // };

  const deleteStudent = async (studentId) => {
    try {
      const response = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel",
      });

      if (response.isConfirmed) {
        const deleteResponse = await axios.delete(
          `https://lnhs-api.vercel.app/api/student/${grade}/${section}/delete/${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (deleteResponse.status === 200) {
          Swal.fire("Deleted!", "Student has been deleted.", "success");
          fetchStudents();
        } else {
          console.error("Delete student error:", deleteResponse.data.message);
        }
      } else if (response.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "Cancelled delete student :)", "error");
      }
    } catch (error) {
      console.error("Delete student error:", error);
    }
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
  };

  const closeEditModal = () => {
    setEditingStudent(null);
  };

  // const updateStudent = async () => {
  //   try {
  //     const response = await axios.put(
  //       `http://localhost:3000/api/student/${editingStudent.grade}/${editingStudent.section}/update/${editingStudent._id}`,
  //       editingStudent,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (response.status === 200) {
  //       closeEditModal();
  //       fetchStudents();
  //       Swal.fire({
  //         icon: "success",
  //         title: "Updated Successfully",
  //         showConfirmButton: false,
  //         timer: 1500,
  //       });
  //       return;
  //     }
  //   } catch (error) {
  //     console.error("Update student error:", error);
  //   }
  // };

  const viewStudentDetails = (student) => {
    setSelectedStudent(student);
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto p-6">
      {isAddStudentModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Add Student</h2>
            <AddStudent
              token={token}
              grade={grade}
              section={section}
              onStudentAdded={() => {
                toggleAddStudentModal();
                fetchStudents();
              }}
              setIsAddStudentModalOpen={setIsAddStudentModalOpen}
            />
          </div>
        </div>
      )}

      {selectedStudent && (
        <StudentDetails
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold mb-4">List of Students</h2>
        <button
          onClick={toggleAddStudentModal}
          className="bg-blue-500 text-white px-2 py-1 rounded mb-2 flex items-center gap-2"
        >
          <span>
            <AiFillPlusCircle />
          </span>
          Add Student
        </button>
      </div>
      <table className="table-auto w-full">
        <thead className=" text-left bg-gray-500 text-white">
          <tr>
            <th className="py-2 px-2">First Name</th>
            <th className="py-2">Middle Name</th>
            <th className="py-2">Last Name</th>
            <th className="py-2">Grade</th>
            <th className="py-2">Section</th>
            <th className="py-2">Actions</th>
            <th className="py-2">QR Code</th>
            <th className="py-2">Attendance</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.studentId}>
              <td className="py-2">{student.firstName}</td>
              <td className="py-2">{student.middleName}</td>
              <td className="py-2">{student.lastName}</td>
              <td className="py-2">{student.grade}</td>
              <td className="py-2">{student.section}</td>
              <td className="py-2">
                {/* <button
                  onClick={() => openEditModal(student)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                  title="Edit Student"
                >
                  <AiOutlineEdit />
                </button> */}
                <button
                  onClick={() => deleteStudent(student.studentId)}
                  className="bg-red-500 text-white px-1 gap-2 py-1 rounded flex items-center"
                  title="Remove Student"
                >
                  <BsFillTrashFill />
                  Remove
                </button>
              </td>
              <td className=" py-2">
                <button
                  title="Download QR Code"
                  onClick={() => viewStudentDetails(student)}
                  className="bg-blue-500 text-white px-1 py-1 rounded flex items-center gap-2"
                >
                  <AiOutlineDownload />
                  QR Code
                </button>
              </td>
              <td className="py-2">
                <button
                  title="View Attendance Record"
                  onClick={() => viewAttendanceRecord(student.studentId)}
                  className="bg-green-500 text-white px-2 py-1 rounded flex items-center gap-2"
                >
                  <span>View Record</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Student Modal */}
      {/* {editingStudent && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="flex flex-col bg-white p-4 rounded shadow-lg w-96 gap-2">
            <h2 className="text-2xl font-bold mb-4">Edit Student</h2>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={editingStudent.firstName}
              onChange={(e) => handleEditInputChange(e, "firstName")}
              className="border rounded px-2 py-1 mb-2 input-style"
            />
            <input
              type="text"
              name="middleName"
              placeholder="Middle Name"
              value={editingStudent.middleName}
              onChange={(e) => handleEditInputChange(e, "middleName")}
              className="border rounded px-2 py-1 mb-2 input-style"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={editingStudent.lastName}
              onChange={(e) => handleEditInputChange(e, "lastName")}
              className="border rounded px-2 py-1 mb-2 input-style"
            />
            <select
              name="grade"
              value={editingStudent.grade}
              onChange={(e) => handleEditInputChange(e, "grade")}
              className="border rounded px-2 py-1 mb-2 input-style"
            >
              <option value="">Select Grade</option>
              {grades.map((grade) => (
                <option key={grade} value={grade}>
                  Grade {grade}
                </option>
              ))}
            </select>
            <select
              name="section"
              value={editingStudent.section}
              onChange={(e) => handleEditInputChange(e, "section")}
              className="border rounded px-2 py-1 mb-2 input-style"
            >
              <option value="">Select Section</option>
              {sections.map((section) => (
                <option key={section} value={section}>
                  Section {section}
                </option>
              ))}
            </select>
            <button
              onClick={updateStudent}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={closeEditModal}
              className="bg-gray-500 text-white px-4 py-2 rounded "
            >
              Cancel
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default StudentList;
