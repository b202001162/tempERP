package student_application_project.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import student_application_project.model.StudentAssignmentSubmission;

import java.util.List;

public interface StudentAssignmentSubmissionRepo extends MongoRepository<StudentAssignmentSubmission, String> {
    @Query("{ 'assignmentId' : ?0 }")
    public List<StudentAssignmentSubmission> findByAssignmentId(String assignmentId);

    @Query("{ 'assignmentId' : ?0, 'studentId' : ?1 }")
    public StudentAssignmentSubmission findByAssignmentIdAndStudentId(String assignmentId, String studentId);

    @Query("{ 'courseId' : ?0, 'studentId' : ?1 }")
    public List<StudentAssignmentSubmission> findByCourseIdAndStudentId(String courseId, String studentId);
}
