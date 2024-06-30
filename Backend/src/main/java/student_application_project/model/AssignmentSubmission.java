package student_application_project.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AssignmentSubmission {
    @Id
    private String assignmentId;
    private String assignmentName;
    private String courseId;
    private String topicName;
    private float maxMarks;
    private List<StudentAssignmentSubmission> studentAssignmentSubmission;
}
