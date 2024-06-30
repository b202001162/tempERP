package student_application_project.repository;

import student_application_project.model.Token;

import java.util.List;

public interface TokenRepo extends org.springframework.data.mongodb.repository.MongoRepository<student_application_project.model.Token, String> {
    @org.springframework.data.mongodb.repository.Query("{ 'courseId' : ?0 }")
    public List<Token> findByCourseId(String courseId);

    @org.springframework.data.mongodb.repository.Query("{ 'courseId' : ?0, 'email' : ?1 }")
    public List<Token> findByCourseIdAndStudentEmail(String courseId, String studentEmail);
}
