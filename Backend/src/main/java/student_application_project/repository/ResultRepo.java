package student_application_project.repository;

import org.springframework.data.mongodb.repository.Query;
import student_application_project.model.Result;

import java.util.List;

public interface ResultRepo extends org.springframework.data.mongodb.repository.MongoRepository<student_application_project.model.Result, String>{
    @Query("{ 'courseId' : ?0, 'email' : ?1 }")
    public Result findByCourseIdAndStudentEmail(String courseId, String email);
}
