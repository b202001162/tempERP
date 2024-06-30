package student_application_project.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import student_application_project.model.InstituteAdmin;

public interface InstituteAdminRepo extends MongoRepository<InstituteAdmin, String> {
    @Query("{ 'email' : ?0 }")
    public InstituteAdmin findByEmail(String email);

    @Query("{ 'instituteName' : ?0 }")
    public InstituteAdmin findByInstituteName(String instituteName);
}
