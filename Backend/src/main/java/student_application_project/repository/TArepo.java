package student_application_project.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import student_application_project.model.TA;

@Repository
public interface TArepo extends MongoRepository<TA, String> {
}
