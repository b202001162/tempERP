package student_application_project.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import student_application_project.model.AssignmentSubmission;

public interface AssignmentSubmissionRepo extends MongoRepository<AssignmentSubmission, String> {
}
