package student_application_project.service;

import student_application_project.model.TA;

public interface TAService {
    public TA saveTA(TA ta);
    public TA getTA(String id);
}
