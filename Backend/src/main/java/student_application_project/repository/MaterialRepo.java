package student_application_project.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import student_application_project.model.Material;

public interface MaterialRepo extends MongoRepository<Material,String> {
}
