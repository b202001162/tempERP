package student_application_project.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import student_application_project.model.Students;

import java.util.List;

public interface StudentApplicationProjectRepo extends MongoRepository<Students, String> {
    @Query("{ 'email' : ?0 }")
    Students findByEmail(String email);

    @Query("{ 'instituteName' : ?0 }")
    List<Students> findByInstituteName(String instituteName);

    void deleteByEmail(String email);

    @Query("{ 'semester' : ?0, 'instituteName' : ?1}")
    List<Students> findBYSemesterAndInstituteName(int semester, String instituteName);
}
