package student_application_project.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SubmissionFiles {
    @Id
    private String id;
    private String fileName;
    private String fileType;
    private String fileDownloadUri;
    private LocalDateTime uploadTime = LocalDateTime.now();
}
