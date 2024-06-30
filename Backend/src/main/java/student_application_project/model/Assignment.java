package student_application_project.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Assignment {
    @Id
    private String id;
    private String name;
    private String description;
    private String url;
    private String courseId;
    private String topicId;
    private float maxMarks;
    private LocalTime createdTime = LocalTime.now();
    private LocalDate createdDate = LocalDate.now();
    private String dueDate;
}
