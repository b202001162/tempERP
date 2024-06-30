package student_application_project.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import student_application_project.model.Faculties;

import java.util.List;

public interface FacultyRepo extends MongoRepository<Faculties, String> {

    @Query("{ 'email':  ?0}")
    public Faculties findByEmail(String email);

    @Query("{ 'instituteName' : ?0 }")
    List<Faculties> findByInstituteName(String instituteName);
}
