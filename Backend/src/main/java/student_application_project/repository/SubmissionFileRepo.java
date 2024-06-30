package student_application_project.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import student_application_project.model.SubmissionFiles;

public interface SubmissionFileRepo extends MongoRepository<SubmissionFiles, String>{
}
