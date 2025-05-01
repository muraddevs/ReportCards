package com.example.demo.controller;

import com.example.demo.entity.Checkboxes;
import com.example.demo.entity.Photo;
import com.example.demo.entity.Report;
import com.example.demo.service.ReportService;
import jakarta.annotation.security.PermitAll;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Base64;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private static final Logger logger = LoggerFactory.getLogger(ReportController.class);


    private final ReportService reportService;
    private final ObjectMapper objectMapper;

    @Autowired
    public ReportController(ReportService reportService, ObjectMapper objectMapper) {
        this.reportService = reportService;
        this.objectMapper = objectMapper;
    }

    @PermitAll
    @PostMapping("/create")
    public Report createReport(
            @RequestParam("category") String category,
            @RequestParam("isAnonymous") boolean isAnonymous,
            @RequestParam("nameAndSurname") String nameAndSurname,
            @RequestParam("occupation") String occupation,
            @RequestParam("department") String department,
            @RequestParam("workingAt") String workingAt,
            @RequestParam("date") String dateString, // Receive date as String
            @RequestParam("observation") String observation,
            @RequestParam("actions") String actions,
            @RequestParam("needAdditionalWork") String needAdditionalWork,
            @RequestParam("additionalDescription") String additionalDescription,
            @RequestParam("checkboxes") String checkboxesJson,
            @RequestParam(value = "photo", required = false) MultipartFile photoFile) throws IOException, ParseException {

        Report report = new Report();
        report.setCategory(category);
        report.setAnonymous(isAnonymous);
        report.setNameAndSurname(nameAndSurname);
        report.setOccupation(occupation);
        report.setDepartment(department);
        report.setWorkingAt(workingAt);

        if (dateString != null && !dateString.isEmpty()){
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"); // Adjust format as needed
            try {
                Date date = dateFormat.parse(dateString);
                report.setDate(date);
            } catch (ParseException e) {
                //Handle the exception, for example by logging it and returning an error response.
                throw new ParseException("Error parsing date: " + dateString, e.getErrorOffset());
            }

        }

        report.setObservation(observation);
        report.setActions(actions);
        report.setNeedAdditionalWork(needAdditionalWork);
        report.setAdditionalDescription(additionalDescription);

        Checkboxes[] checkboxesArray = objectMapper.readValue(checkboxesJson, Checkboxes[].class);
        for (Checkboxes checkbox : checkboxesArray) {
            if (checkbox.getTitle() == null || checkbox.getTitle().isEmpty()) {
                checkbox.setTitle("Digər");
            }
            checkbox.setReport(report);
            report.getCheckboxes().add(checkbox);
        }

        if (photoFile != null && !photoFile.isEmpty()) {
            Photo photo = new Photo();
            photo.setData(photoFile.getBytes());
            photo.setContentType(photoFile.getContentType());
            photo.setReport(report);
            report.setPhoto(photo);
        }

        return reportService.saveReport(report);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<List<Report>> getAllReports() {
        List<Report> reports = reportService.getAllReports();

        logger.info("Fetched reports count: {}", reports.size()); // Debugging
        for (Report report : reports) {
            logger.info("Report ID: {}, Category: {}", report.getId(), report.getCategory());
        }

        try {
            String jsonString = objectMapper.writeValueAsString(reports);
            logger.info("JSON Response: {}", jsonString); // Log the JSON
        } catch (Exception e) {
            logger.error("Error serializing reports to JSON", e);
        }

        // Ensure you return a list, even if it's empty
        return ResponseEntity.ok(reports != null ? reports : Collections.emptyList());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReport(@PathVariable Long id) {
        Report deletedReport = reportService.deleteReport(id);
        if (deletedReport != null) {
            return ResponseEntity.ok("Report deleted successfully.");
        } else {
            return ResponseEntity.notFound().build();
        }
    }




}