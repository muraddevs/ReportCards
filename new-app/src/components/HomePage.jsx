import React, {useEffect, useState} from "react";
import "../designs/HomePage.css";
import ReportCard from "./ReportCard";
import axios from "axios";


const HomePage = () => {
    const reportData = [
        {
            id: 1,
            title: "İŞİN İCRASINA İCAZƏ",
            labels: [
                { id: 101, name: "İşin icrasına icazə" },
                { id: 102, name: "Risk qiymətləndirməsi" },
                { id: 103, name: "İş planı" }
            ]
        },
        {
            id: 2,
            title: "NƏQLİYYATDA TƏHLÜKƏSİZLİK",
            labels: [
                { id: 201, name: "Sürət həddi" },
                { id: 202, name: "Təhlükəsizlik kəməri" },
                { id: 203, name: "Yol nişanları" }
            ]
        },
        {
            id: 3,
            title: "YÜKSƏKLİKDƏ GÖRÜLƏN İŞLƏR",
            labels: [
                { id: 301, name: "Prosedur, təlimat, qaydalar" },
                { id: 302, name: "Yıxılmadan qoruyucu avadanlıq" },
                { id: 303, name: "Taxtabənd / Məhəccər / Səbət" },
                { id: 304, name: "Düşən əşyalar" }
            ]
        },
        {
            id: 4,
            title: "TORPAQ İŞLƏRİ",
            labels: [
                { id: 401, name: "Açıq çuxur" },
                { id: 402, name: "Yeraltı xətlər" },
                { id: 403, name: "Qazma avadanlığı" },
                { id: 404, name: "Baryerlər" }
            ]
        },
        {
            id: 5,
            title: "ODLU İŞLƏR",
            labels: [
                { id: 501, name: "Odsöndürücü vasitələr" },
                { id: 502, name: "Yanar maddələrin təmizlənməsi" },
                { id: 503, name: "Hava mühitinin analizi" }
            ]
        },
        {
            id: 6,
            title: "QAPALI SAHƏ",
            labels: [
                { id: 601, name: "Gözətçi / giriş-çıxış" },
                { id: 602, name: "Qaz testi" },
                { id: 603, name: "Xilasetmə planı" }
            ]
        },
        {
            id: 7,
            title: "TƏHLÜKƏSİZ YÜKQALDIRMA",
            labels: [
                { id: 701, name: "Kranla görülən işlər" },
                { id: 702, name: "Avtoyükləyici / çəngəlli qaldırıcı ilə görülən işlər" },
                { id: 703, name: "Tal / telfer" },
                { id: 704, name: "Yükqaldırma ləvazimatı" }
            ]
        },
        {
            id: 8,
            title: "ENERJİNİN TƏCRİD EDİLMƏSİ",
            labels: [
                { id: 801, name: "Səriştəli işçilər" },
                { id: 802, name: "Elektrik cərəyanı ilə təmas" },
                { id: 803, name: "Kənar şəxslərin müdaxiləsi" },
                { id: 804, name: "Enerjinin təcrid edilməsi" }
            ]
        },
        {
            id: 9,
            title: "ATƏŞ XƏTTİ",
            labels: [
                { id: 901, name: "Hərəkət edən və ya düşən obyektlər" },
                { id: 902, name: "Avadanlıqların arasında/ altında qalma, vurulma" },
                { id: 903, name: "Yığılmış enerji" }
            ]
        },
        {
            id: 10,
            title: "FÖVQƏLADƏ HALLAR",
            labels: [
                { id: 1001, name: "Təxliyə yolları / qəza çıxışları" },
                { id: 1002, name: "Yanğına qarşı resurslar, tədbirlər" },
                { id: 1003, name: "Prosedur, təlimat" }
            ]
        },
        {
            id: 11,
            title: "DİGƏR",
            labels: [
                { id: 1101, name: "Əl ilə yükqaldırma" },
                { id: 1102, name: "Fərdi Mühafizə Vasitələri" },
                { id: 1103, name: "İş şəraiti (işıqlandırma, havalandırma, temperatur)" },
                { id: 1104, name: "İlişmə / sürüşmə / yıxılma" }
            ]
        }
    ];

    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [category, setCategory] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [nameAndSurname, setNameAndSurname] = useState("");
    const [occupation, setOccupation] = useState("");
    const [department, setDepartment] = useState("");
    const [workingAt, setWorkingAt] = useState("");
    const [date, setDate] = useState("");
    const [observation, setObservation] = useState("");
    const [actions, setActions] = useState("");
    const [needAdditionalWork, setNeedAdditionalWork] = useState("");
    const [additionalDescription, setAdditionalDescription] = useState("");

    const [checkboxes, setCheckboxes] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    



    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleCheckboxChange = (event) => {
        setIsAnonymous(event.target.checked);
    };

    const handleCheckboxChangeMeasures = (option) => {
        setSelectedOption(selectedOption === option ? null : option);
    };

    const handleCheckboxChangeSelectedId = (id) => {
        setSelectedId(selectedId === id ? null : id);
    };

    const handleReportCardChange = (title, selectedLabels, description) => {
        console.log("handleReportCardChange:", title, selectedLabels, description);
        const existingCheckboxIndex = checkboxes.findIndex(cb => cb.title === title);

        let descriptionToStore = "";
        if (selectedLabels && selectedLabels.length > 0) {
            descriptionToStore = selectedLabels.join(", ");
        }

        if (existingCheckboxIndex !== -1) {
            const updatedCheckboxes = [...checkboxes];
            updatedCheckboxes[existingCheckboxIndex].checkedLabels = selectedLabels.map(label => ({
                label: label,
                groupTitle: title, // Use the ReportCard's title as groupTitle
            }));
            updatedCheckboxes[existingCheckboxIndex].description = descriptionToStore;
            setCheckboxes(updatedCheckboxes);
        } else {
            const newCheckbox = {
                title: title,
                checkedLabels: selectedLabels.map(label => ({
                    label: label,
                    groupTitle: title, // Use the ReportCard's title as groupTitle
                })),
                description: descriptionToStore,
                groupTitle: title, // Store the title as groupTitle in checkboxes
            };
            setCheckboxes(prevCheckboxes => [...prevCheckboxes, newCheckbox]);
        }
    };

    const handleSubmit = async () => {
        try {
            let formattedDate = date ? new Date(date).toISOString() : "";

            const filteredCheckboxes = checkboxes.filter(checkbox => checkbox.checkedLabels.length > 0);

            const formData = new FormData();
            formData.append("category", category);
            formData.append("isAnonymous", JSON.stringify(isAnonymous));
            formData.append("nameAndSurname", nameAndSurname);
            formData.append("occupation", occupation);
            formData.append("department", department);
            formData.append("workingAt", workingAt);
            formData.append("date", formattedDate);
            formData.append("observation", observation);
            formData.append("actions", actions);
            formData.append("needAdditionalWork", needAdditionalWork);
            formData.append("additionalDescription", additionalDescription);
            formData.append("checkboxes", JSON.stringify(filteredCheckboxes));

            if (selectedFile) {
                formData.append("photo", selectedFile);
            }

            console.log("Form Data:", Object.fromEntries(formData.entries()));

            const response = await axios.post("http://localhost:8080/api/reports/create", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log("Success:", response.data);
            alert("Report submitted successfully!");
        } catch (error) {
            console.error("Error submitting report:", error.response?.data || error.message);
            alert("Failed to submit report.");
        }
    };



    return (
        <div className="homepage">


            <h1>Davranış və Təhlükəsizliyin Müşahidə Kartı</h1>

            <div className="card-container">
                {[
                    {id: 1, label: "Təhlükəsiz davranış", color: "green"},
                    {id: 2, label: "Təhlükəli davranış", color: "red"},
                    {id: 3, label: "Təhlükəli şərait", color: "red"},
                ].map((item) => (
                    <div key={item.id} className="card">
                        <div
                            className="circle"
                            style={{
                                backgroundColor: item.color,
                            }}
                        />
                        <label className="card-label">
                            {item.label}
                            <input
                                type="checkbox"
                                className="checkbox"
                                checked={selectedId === item.id}
                                onChange={() => {
                                    handleCheckboxChangeSelectedId(item.id);
                                    setCategory(item.label);
                                }}
                            />
                        </label>
                    </div>
                ))}
            </div>

            <div className="container-blue">
                <h1> Yoxlama vərəqi</h1>
                <h1>Müşahidənizə aid olan(lar)ı seçin</h1>
            </div>

            <div className="card-container">
                {reportData.map((item) => (
                    <ReportCard
                        key={item.id}
                        title={item.title}
                        labels={item.labels.map(label => label.name)}
                        onChange={(selectedLabels) => {
                            console.log("HomePage Received Labels:", selectedLabels); // Add this line
                            handleReportCardChange(item.title, selectedLabels);
                        }}
                    />
                ))}
            </div>

            <div className="form-section">
                <h1>Müşahidəyə dair məlumatlar</h1>

                <div className="anonymous-section">
                    <label htmlFor="anonymous">Anonim</label>
                    <input
                        type="checkbox"
                        className="checkbox"
                        id="anonymous"
                        checked={isAnonymous}
                        onChange={handleCheckboxChange}/>
                </div>

                <h2 htmlFor="name">Müşahidəçinin adı və soyadı:</h2>
                <input
                    type="text"
                    className="input-field"
                    id="name"
                    placeholder="Ad və soyadınızı daxil edin"
                    disabled={isAnonymous}
                    onChange={(e) => setNameAndSurname(e.target.value)}
                />

                <h2>Vəzifəsi</h2>
                <input
                    type="text"
                    className="input-field"
                    placeholder="Vəzifəni daxil edin"
                    disabled={isAnonymous}
                    onChange={(e) => setOccupation(e.target.value)}
                />


                <h2>Müəssisə:</h2>
                <input
                    type="text"
                    className="input-field"
                    placeholder="Müəssisə adı"
                    disabled={isAnonymous}
                    onChange={(e) => setDepartment(e.target.value)}
                />

                <h2>İş sahəsi:</h2>
                <input
                    type="text"
                    className="input-field"
                    placeholder="İş sahəsini daxil edin"
                    disabled={isAnonymous}
                    onChange={(e) => setWorkingAt(e.target.value)}
                />

                <br/>

                <h2>Tarix və saat:</h2>
                <input type="datetime-local" className="input-field" onChange={(e) => setDate(e.target.value)}/>

                <h2 htmlFor="description">Müşahidənin təsviri:</h2>
                <textarea
                    className="textarea"
                    id="description"
                    placeholder="Müşahidənin təsvirini yazın"
                    style={{resize: "none"}}
                    onChange={(e) => setObservation(e.target.value)}></textarea>
                <br/>

                <h2 htmlFor="actionsTaken">Hansı tədbirlər görülmüşdür?</h2>
                <textarea className="textarea" id="actionsTaken" placeholder="Görülən tədbirləri yazın"
                          style={{resize: "none"}}
                          onChange={(e) => setActions(e.target.value)}></textarea>
                <br/>

                <h2>Əlavə tədbirlər tələb olunurmu?</h2>
                <div className="actions">
                    <label htmlFor="additionalMeasuresYes">Bəli</label>
                    <input
                        type="radio"
                        className="checkbox"
                        id="additionalMeasuresYes"
                        name="additionalMeasures"
                        checked={selectedOption === "yes"}
                        onChange={() => {
                            handleCheckboxChangeMeasures("yes");
                            setNeedAdditionalWork("yes");
                        }}
                    />

                    <label htmlFor="additionalMeasuresNo">Xeyr</label>
                    <input
                        type="radio"
                        className="checkbox"
                        id="additionalMeasuresNo"
                        name="additionalMeasures"
                        checked={selectedOption === "no"}
                        onChange={() => {
                            handleCheckboxChangeMeasures("no");
                            setNeedAdditionalWork("no");
                        }}
                    />
                </div>


                <h2>Şərhlər / tövsiyələr:</h2>
                <textarea
                    className="textarea"
                    placeholder="Şərhlər və tövsiyələri yazın"
                    style={{resize: "none"}}
                    onChange={(e) => setAdditionalDescription(e.target.value)}></textarea>

                <h2>Photo:</h2>
                <input type="file" onChange={handleFileChange}/>

                <button type="submit" className="submit-btn" onClick={handleSubmit}>Təsdiq Edin</button>
            </div>
        </div>
    );
};

export default HomePage;
