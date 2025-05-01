import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import '../designs/ReportsPage.css';

function ReportsPage() {
    const [reports, setReports] = useState([]);
    const [selectedReports, setSelectedReports] = useState([]);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'table'
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const token = Cookies.get('token');
                if (!token) {
                    navigate('/login');
                    return;
                }
                const decodedToken = jwtDecode(token);
                if (decodedToken.exp < Date.now() / 1000) {
                    alert("Session expired. Please log in again.");
                    navigate('/login');
                    return;
                }
                if (!decodedToken.roles.includes('ADMIN')) {
                    navigate('/');
                    return;
                }
                const response = await axios.get('http://localhost:8080/api/reports/all', {
                    headers: { 'Authorization': `Bearer ${token}` },
                    withCredentials: true,
                });
                setReports(response.data);
            } catch (error) {
                console.error("Error fetching reports:", error);
            }
        };
        fetchReports();
    }, [navigate]);

    const handleCheckboxChange = (id) => {
        setSelectedReports(prev =>
            prev.includes(id) ? prev.filter(reportId => reportId !== id) : [...prev, id]
        );
    };

    function formatCheckboxData(checkboxes) {
        if (!checkboxes || checkboxes.length === 0) {
            return "No checkboxes";
        }

        return checkboxes.map(cb => {
            const labels = cb.checkedLabels.map(labelObj => `${labelObj.label} (${labelObj.groupTitle})`).join("\n"); // Use \n for line breaks
            return `${cb.title}:\n${labels}`; // Remove <b> tags, as jsPDF-autotable doesn't directly support HTML
        }).join("\n\n"); // Use \n\n for spacing between checkboxes
    }

    const truncate = (text, limit = 100) =>
        text && text.length > limit ? text.substring(0, limit) + '...' : text;


    const generatePDF = (filteredReports, fileName = "Reports.pdf") => {
        const doc = new jsPDF();
        doc.setFontSize(10);
        doc.text("Reports", 10, 10);

        if (viewMode === 'list') {
            autoTable(doc, {
                startY: 20,
                head: [["ID", "Name", "Occupation", "Department", "Date"]],
                body: filteredReports.map(report => [
                    report.id,
                    report.nameAndSurname,
                    report.occupation,
                    report.department,
                    report.date
                ]),
            });
        } else {
            const tableHeaders = [
                "ID", "Date", "Anonymous", "Name", "Occupation", "Department", "Working at",
                "Observation", "Actions", "Need Additional Work", "Additional Description",
                "Checkbox Title", "Checked Labels"
            ];
            const tableBody = filteredReports.map(report => {
                const checkboxData = formatCheckboxData(report.checkboxes);

                return [
                    truncate(report.id?.toString(), 150),
                    truncate(new Date(report.date).toLocaleDateString(), 150),
                    truncate(report.isAnonymous ? "Yes" : "No", 150),
                    truncate(report.nameAndSurname || "N/A", 150),
                    truncate(report.occupation || "N/A", 150),
                    truncate(report.department || "N/A", 150),
                    truncate(report.workingAt || "N/A", 150),
                    truncate(report.observation || "", 150),
                    truncate(report.actions || "", 150),
                    truncate(report.needAdditionalWork?.toString() || "No", 150),
                    truncate(report.additionalDescription || "", 150),
                    truncate(checkboxData || "", 150)
                ];
            });


            autoTable(doc, {
                startY: 20,
                head: [tableHeaders],
                body: tableBody,
                columnStyles: {
                    0: { cellWidth: 10 },
                    1: { cellWidth: 20 },
                    2: { cellWidth: 15 },
                    3: { cellWidth: 25 },
                    4: { cellWidth: 20 },
                    5: { cellWidth: 20 },
                    6: { cellWidth: 25 },
                    7: { cellWidth: 40 },  // observation
                    8: { cellWidth: 30 },  // actions
                    9: { cellWidth: 20 },
                    10: { cellWidth: 40 }, // additional description
                    11: { cellWidth: 40 }, // checkbox title and labels
                    12: { cellWidth: 0 }   // empty
                },
                styles: { fontSize: 7, overflow: 'linebreak' }, // Ensures wrapping
                pageBreak: 'auto',
            });


            doc.save(fileName);
    }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this report?")) {
            try {
                const token = Cookies.get('token');
                await axios.delete(`http://localhost:8080/api/reports/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                    withCredentials: true,
                });
                setReports(reports.filter(report => report.id !== id));
            } catch (error) {
                console.error("Error deleting report:", error);
            }
        }
    };



    return (
        <div className="reports-container">
            <h1 className="title">Reports</h1>
            <div className="button-container">
                <button className="actionButtons" onClick={() => generatePDF(reports)}>Download All Reports</button>
                <button className="actionButtons" onClick={() => generatePDF(reports.filter(report => selectedReports.includes(report.id)), "Selected_Reports.pdf")}>Download Selected</button>
                <button className="actionButtons" onClick={() => setViewMode(viewMode === 'list' ? 'table' : 'list')}>
                    Switch to {viewMode === 'list' ? 'Table' : 'List'} View
                </button>
            </div>
            {reports.length === 0 ? (
                <p>No reports available.</p>
            ) : viewMode === 'list' ? (
                <ul className="reports-list">
                    {reports.map((report) => (
                        <li key={report.id} className="report-item">
                            <input
                                type="checkbox"
                                checked={selectedReports.includes(report.id)}
                                onChange={() => handleCheckboxChange(report.id)}
                            />
                            <h2>Report ID: {report.id}</h2>
                            <button onClick={() => handleDelete(report.id)} className="delete-button">Delete</button>
                            <p><strong>Anonymous:</strong> {report.isAnonymous}</p>
                            <p><strong>Name:</strong> {report.nameAndSurname}</p>
                            <p><strong>Occupation:</strong> {report.occupation}</p>
                            <p><strong>Department:</strong> {report.department}</p>
                            <p><strong>Working At:</strong> {report.workingAt}</p>
                            <p><strong>Date:</strong> {report.date}</p>
                            <p><strong>Observation:</strong> {report.observation}</p>
                            <p><strong>Actions:</strong> {report.actions}</p>
                            <p><strong>Need Additional Work:</strong> {report.needAdditionalWork}</p>
                            <p><strong>Additional Description:</strong> {report.additionalDescription}</p>

                            {report.checkboxes && report.checkboxes.length > 0 && (
                                <div className="checkboxes-container">
                                    <p><strong>Checkboxes:</strong></p>
                                    <table border="1">
                                        <thead>
                                        <tr>
                                            <th>Checkbox Title</th>
                                            <th>Checked Labels</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {report.checkboxes.map((checkbox, index) => (
                                            <tr key={index}>
                                                <td><strong>{checkbox.title}</strong></td>
                                                <td>
                                                    {checkbox.checkedLabels && checkbox.checkedLabels.length > 0 ? (
                                                        <ul>
                                                            {checkbox.checkedLabels.map((labelObj, i) => (
                                                                <li key={i}>{labelObj.label} ({labelObj.groupTitle})</li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        "No labels checked"
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {report.photo && report.photo.data && report.photo.contentType && (
                                <div className="report-photo-container">
                                    <img
                                        src={`data:${report.photo.contentType};base64,${report.photo.data}`}
                                        alt="Report"
                                        className="report-photo"
                                    />
                                </div>
                            )}
                        </li>
                    ))}
                </ul>

            ) : (
                <table className="reports-table">
                    <thead>
                    <tr>
                        <th>Select</th>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Anonymous</th>
                        <th>Name</th>
                        <th>Occupation</th>
                        <th>Department</th>
                        <th>Working at:</th>
                        <th>Observation:</th>
                        <th>Actions:</th>
                        <th>Need Additional Work</th>
                        <th>Additional Description</th>
                        <th>Checkbox Title</th>
                        <th>Checked Labels</th>
                        <th>Photo</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reports.map(report => (
                        <tr key={report.id}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedReports.includes(report.id)}
                                    onChange={() => handleCheckboxChange(report.id)}
                                />
                            </td>
                            <td>{report.id}</td>
                            <td>{new Date(report.date).toLocaleDateString()}</td>
                            <td>{report.isAnonymous ? "Yes" : "No"}</td>
                            <td>{report.nameAndSurname}</td>
                            <td>{report.occupation}</td>
                            <td>{report.department}</td>
                            <td>{report.workingAt}</td>
                            <td>{report.observation}</td>
                            <td>{report.actions}</td>
                            <td>{report.needAdditionalWork}</td>
                            <td>{report.additionalDescription}</td>
                            <td>
                                {report.checkboxes && report.checkboxes.length > 0 ? (
                                    report.checkboxes.map((checkbox, index) => (
                                        <div key={index}>
                                            <strong>{checkbox.title}</strong>
                                        </div>
                                    ))
                                ) : "No checkboxes"}
                            </td>
                            <td>
                                {report.checkboxes && report.checkboxes.length > 0 ? (
                                    <ul>
                                        {report.checkboxes.flatMap((checkbox, index) =>
                                            checkbox.checkedLabels.map((labelObj, i) => (
                                                <li key={`${index}-${i}`}>
                                                    {labelObj.label} ({labelObj.groupTitle})
                                                </li>
                                            ))
                                        )}
                                    </ul>
                                ) : "No checked labels"}
                            </td>
                            <td>
                                {report.photo && report.photo.data && report.photo.contentType && (
                                    <div className="report-photo-container">
                                        <img
                                            src={`data:${report.photo.contentType};base64,${report.photo.data}`}
                                            alt="Report"
                                            className="report-photo"
                                        />
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

            )}
        </div>
    );
}

export default ReportsPage;
