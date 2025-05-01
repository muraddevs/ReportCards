import React, {useEffect, useState} from "react";
import "../designs/ReportCards.css";

const ReportCard = ({ title, labels, onChange }) => {
    const [selectedLabels, setSelectedLabels] = useState([]);
    const [otherLabel, setOtherLabel] = useState("");

    const handleCheckboxChange = (label) => {
        const newSelectedLabels = selectedLabels.includes(label)
            ? selectedLabels.filter((l) => l !== label)
            : [...selectedLabels, label];

        setSelectedLabels(newSelectedLabels);
        onChange(newSelectedLabels);
    };

    const handleOtherLabelChange = (e) => {
        const value = e.target.value.trim();
        setOtherLabel(value);

        if (value) {
            // Replace existing labels with the new value
            setSelectedLabels([value]);
            onChange([value]);
        } else {
            // Clear the selected labels if the input is empty
            setSelectedLabels([]);
            onChange([]);
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleOnChange = () => {
        onChange(selectedLabels);
    };

    useEffect(() => {
        handleOnChange();
    }, [handleOnChange, selectedLabels]);

    return (
        <div className="report-card">
            <h2 className="report-card-title">{title}</h2>
            {labels.map((label, index) => (
                <div key={index} className="checkbox-item">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            className="checkbox-input"
                            checked={selectedLabels.includes(label)}
                            onChange={() => handleCheckboxChange(label)}
                        />
                        {label}
                    </label>
                </div>
            ))}
            <div className="other-label-input">
                <input
                    type="text"
                    placeholder="Digər"
                    value={otherLabel}
                    onChange={handleOtherLabelChange}
                />
            </div>
        </div>
    );
};

export default ReportCard;