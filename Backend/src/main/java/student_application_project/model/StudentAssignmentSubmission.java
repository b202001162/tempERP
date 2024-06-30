package student_application_project.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.w3c.dom.stylesheets.LinkStyle;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StudentAssignmentSubmission {
    @Id
    private String id;
    private String assignmentId;
    private String assignmentName;
    private String courseId;
    private String topicName;
    private String studentId;
    private String studentName;
    private List<SubmissionFiles> submissionFiles;
    private Boolean isEvaluated = false;
    private float maxMarks;
    private float obtainedMarks;
}
