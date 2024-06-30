package student_application_project.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Result {
    @Id
    private String id;
    private String email;
    private String courseId;
    // grades must be 1 to 10
    private short grades = 1;
    private String feedback;
    private String facultyEmail;
}
