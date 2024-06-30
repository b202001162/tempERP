package student_application_project.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import student_application_project.model.SuperAdmin;

public interface SuperAdminRepo extends MongoRepository<SuperAdmin, String> {
    @Query("{ 'email' : ?0 }")
    public SuperAdmin findByEmail(String email);
}
