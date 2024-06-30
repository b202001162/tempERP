package student_application_project.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.web.service.annotation.GetExchange;

import java.time.LocalDate;
import java.time.LocalTime;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Video {
    @Id
    private String id;
    private String name;
    private String description;
    private String url;
    private String courseId;
    private String topicId;
    private LocalDate createdDate = LocalDate.now();
    private LocalTime createdTime = LocalTime.now();
}
