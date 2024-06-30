package student_application_project.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import org.springframework.data.mongodb.repository.Query;
import student_application_project.model.Course;

import java.util.List;

public interface CourseRepo extends MongoRepository<Course, String>{

    @Query("{ 'facultyEmail' : ?0 }")
    public List<Course> findByFacultyEmail(String facultyEmail);

    @Query("{ 'semester' : ?0 }")
    public List<Course> findBySemester(short semester);

    @Query("{ 'instituteName' : ?1, 'semester' : ?0}")
    public List<Course> findBySemesterAndInstituteName(int semester, String instituteName);

    @Query("{ 'instituteName' :  ?0 }")
    public List<Course> findByInstituteName(String instituteName);
}
