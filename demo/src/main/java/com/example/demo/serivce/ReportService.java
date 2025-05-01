package com.example.demo.service;

import com.example.demo.entity.Report;
import com.example.demo.repository.ReportRepository;
import org.slf4j.Logger; // Correct import
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private static final Logger logger = LoggerFactory.getLogger(ReportService.class); // Use org.slf4j.Logger

    @Autowired
    public ReportService(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    public Report saveReport(Report report) {
        return reportRepository.save(report);
    }

    public List<Report> getAllReports() {
        logger.info("Fetching all reports");
        List<Report> reports = reportRepository.findAll();
        logger.info("Number of reports found: {}", reports.size());
        return reports;
    }

    public Report deleteReport(Long id) {
        Report report = reportRepository.findById(id).orElse(null);
        if (report != null) {
            reportRepository.delete(report);
        }
        return report;
    }
}